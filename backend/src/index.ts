import bcrypt from "bcryptjs";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();
const JWT_SECRET = "secret_key"; // Centralized secret key

app.use(cors());
app.use(express.json());

// ==========================================
//  AUTHENTICATION MIDDLEWARE
// ==========================================
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Expects format: "Bearer token_string"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next(); // Pass control to the next route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ==========================================
//  PUBLIC ROUTES (No token required)
// ==========================================
app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

app.post("/register", async (req: any, res: any) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ message: "Internal server error during registration", error: errorMessage });
  }
});

app.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body || {};

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({ message: "Login successful", token });
      }
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ message: "Internal server error during login", error: errorMessage });
  }
});

// ==========================================
//  PROTECTED ROUTES (Requires middleware)
// ==========================================

// Profile Route now uses the clean middleware handler
app.get("/profile", authenticateToken, (req: any, res: any) => {
  res.json({
    message: "Protected profile data",
    user: req.user // Decoded data passed directly from middleware
  });
});

// GET /tasks
app.get("/tasks", authenticateToken, async (req: any, res: any) => {
  const tasksFromDatabase = await prisma.task.findMany({
    orderBy: { id: 'asc' }
  });
  res.json(tasksFromDatabase);
});

// POST /tasks
app.post("/tasks", authenticateToken, async (req: any, res: any) => {
  const { text } = req.body || {};
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Task text is required" });
  }
  
  const newTask = await prisma.task.create({
    data: { text, completed: false }
  });
  res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put("/tasks/:id", authenticateToken, async (req: any, res: any) => {
  const id = Number(req.params.id);

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed: !task.completed }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task status" });
  }
});

// DELETE /tasks/:id
app.delete("/tasks/:id", authenticateToken, async (req: any, res: any) => {
  const id = Number(req.params.id);

  try {
    const deletedTask = await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res.status(404).json({ message: "Task not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});