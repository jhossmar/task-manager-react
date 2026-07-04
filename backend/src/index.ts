// JWT: We import jsonwebtoken to create and verify tokens.
const jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
// PRISMA CHANGE: Import Prisma Client
 const { PrismaClient } = require("@prisma/client");
//import { PrismaClient } from '@prisma/client';
//import { PrismaClient } from './generated/prisma/client';
const app = express();
const PORT = 3000;


// PRISMA CHANGE: Create the connection to PostgreSQL through Prisma
const prisma = new PrismaClient();
app.use(express.json());

app.use(cors());
app.use(express.json());

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// This array is still here because POST, PUT, and DELETE are not connected to Prisma yet.
// PRISMA CHANGE: GET /tasks will no longer use this array.
let tasks: Task[] = [
{ id: 1, text: "Estudiar Node.js", completed: false },
{ id: 2, text: "Crear servidor Express", completed: true },
{ id: 3, text: "Probar rutas del backend", completed: false }
];
app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

// JWT: This is a basic login route.
// JWT: For now, we are using fixed credentials only for practice.
app.post("/login", (req: any, res: any) => {
  const { email, password } = req.body || {};
  // JWT: If the credentials are correct, we create a token.
  // JWT: This is the information stored inside the token.
  if (email === "admin@test.com" && password === "123456") {
    const token = jwt.sign(
      { 
        email: email 
      },"secret_key",
      { 
        expiresIn: "1h" // JWT: The token will expire in 1 hour.
        }
      );
      return res.json({
        message: "Login successful",
        token: token
      });
    }else{
       res.status(401).json({
        message: "Invalid credentials"
      });
    }

  });

// NEW JWT CHANGE: This is a protected route.
// NEW JWT CHANGE: The user must send a valid token to access this route.
app.get("/profile", (req: any, res: any) => {
  // NEW JWT CHANGE: The token is expected in the Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  // NEW JWT CHANGE: The header usually looks like "Bearer token_here".
  // NEW JWT CHANGE: We split it and take only the token part.
  const token = authHeader.split(" ")[1];
  try {
    // NEW JWT CHANGE: jwt.verify checks if the token is valid.
    const decoded = jwt.verify(token, "secret_key");
    res.json({
      message: "Protected profile data",
      user: decoded
    });
  }catch (error) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
});

// PRISMA CHANGE: GET /tasks now reads from PostgreSQL instead of the array
app.get("/tasks", async (req: any, res: any) => {
  const tasksFromDatabase = await prisma.task.findMany();
  res.json(tasksFromDatabase);
});

// app.post("/tasks", (req: any, res: any) => {
//   const { text } = req.body || {};
//   if (!text || text.trim() === "") {
//     return res.status(400).json({ message: "Task text is required" });
//   }
//   const newTask: Task = { id: Date.now(), text: text, completed: false };
//   tasks.push(newTask);
//   res.status(201).json(newTask);
// });

// NEW CHANGE: POST /tasks now saves the new task in PostgreSQL using Prisma.
app.post("/tasks", async (req: any, res: any) => {
  const { text } = req.body || {};
  if (!text || text.trim() === "") {
    return res.status(400).json({
      message: "Task text is required"
    });
  }
  
  const newTask = await prisma.task.create({
    data: {
      text: text,
      completed: false
    }
  });

  res.status(201).json(newTask);
});


app.put("/tasks/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  
  task.completed = !task.completed;
  res.json(task);
});

// app.delete("/tasks/:id", (req: any, res: any) => {
//   const id = Number(req.params.id);
//   const taskExists = tasks.some((task) => task.id === id);
//   if (!taskExists) {
//     return res.status(404).json({ message: "Task not found" });
//   }
//   const updateTasks = tasks.filter((task) => task.id !== id);
//   tasks.push(...updateTasks); // Push the updated tasks back into the original array

//   res.json({
//      message: "Task deleted successfully",
//      tasks: tasks
//     });


// });
// NEW CHANGE: DELETE /tasks/:id now deletes the task from PostgreSQL using Prisma
app.delete("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);

  try {
    // 1. Ask Prisma to delete the task matching the provided ID
    const deletedTask = await prisma.task.delete({
      where: { id: id }
    });

    // 2. Return the successfully deleted task
    res.json({
      message: "Task deleted successfully",
      task: deletedTask
    });

  } catch (error) {
    // 3. If Prisma throws an error (e.g., Record to delete does not exist), catch it gracefully
    res.status(404).json({ 
      message: "Task not found" 
    });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
