const express = require("express");
const app = express();
const PORT = 3000;

type Task = {
  id: number;
  text: string;
  completed: boolean;
};


app.use(express.json());


const tasks: Task[] = [
  { id: 1, text: "Estudiar Node.js", completed: true },
  { id: 2, text: "Crear servidor Express", completed: true },
  { id: 3, text: "Probar las rutas del backend", completed: false },
];

app.get("/tasks", (req: any, res: any) => {
  res.json(tasks);
});

app.put("/tasks/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const { text, completed } = req.body;
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }
  if (text !== undefined) {
    task.text = text;
  }
  
  if (completed !== undefined) {
    task.completed = completed;
  }
  
  
  res.json(task);
});


app.post("/tasks", (req: any, res: any) => {
 const {text}= req.body;
 if (!text || text.trim() === "") {
  return res.status(400).json({ message: "Task text is required" });
 }

 const newTask: Task = {
  id: Date.now(), // Use timestamp as a unique ID
  text: text.trim(),
  completed: false,
 };
 tasks.push(newTask);
 res.status(201).json(newTask);

});

app.get("/",(req: any, res: any) => {
  res.send("Backend is working!");
});

app.delete("/tasks/:id", (req: any, res: any) => {
  const id =  Number(req.params.id);
  const taskExists = tasks.some((task) => task.id === id);
  if (!taskExists) {
    return res.status(404).json({ message: "Task not found" });
  }
const updateTasks = tasks.filter((task) => task.id !== id);
tasks.length = 0; // Clear the original array
tasks.push(...updateTasks); // Push the updated tasks back into the original array

  res.json({
     message: "Task deleted successfully",
     tasks: tasks
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});