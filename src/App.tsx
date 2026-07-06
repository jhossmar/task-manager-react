// 1. Importamos useEffect junto a useState
import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

// SOLUCIÓN AL ERROR DE TYPESCRIPT:
// Agregamos 'createdAt' como opcional (?) para que coincida con lo que manda PostgreSQL
type Task = {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string; 
};

function App() {
  // 2. El Estado ahora inicia VACÍO, esperando los datos del backend
  const [tasks, setTasks] = useState<Task[]>([]);

  // CARGAR TAREAS DESDE EL BACKEND AL INICIAR
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };
    fetchTasks();
  }, []);

  // 3. AGREGAR una tarea conectada al Backend
  const addTask = async (text: string) => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // 4. ELIMINAR una tarea conectada al Backend
  const deleteTask = (id: number) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE", // Método HTTP para borrar recursos
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar la tarea en el servidor");
        }
        // CORRECCIÓN: Como el backend responde con 204 (No Content), 
        // no hacemos response.json(), pasamos directo a actualizar el estado local.
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch((error) => console.error("Error al eliminar la tarea:", error));
  };

  // // 5. MARCAR COMO COMPLETADA / PENDIENTE (Local temporal - Reto opcional)
  // const toggleTask = (id: number) => {
  //   const updatedTasks = tasks.map((task) => {
  //     if (task.id === id) {
  //       return { ...task, completed: !task.completed };
  //     }
  //     return task;
  //   });
  //   setTasks(updatedTasks);
  // };

// 5. MARCAR COMO COMPLETADA / PENDIENTE conectada al Backend
  const toggleTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la tarea en el servidor");
      }

      const updatedTaskFromBackend = await response.json();

      // Actualizamos el estado local con la respuesta del backend
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return updatedTaskFromBackend;
        }
        return task;
      });
      setTasks(updatedTasks);

    } catch (error) {
      console.error("Error al alternar el estado de la tarea:", error);
    }
  };

  // 6. CALCULADORES AUTOMÁTICOS
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app-container">
      <Header />
      
      <TaskInput onAddTask={addTask} />
      
      <TaskList 
        tasks={tasks} 
        onDeleteTask={deleteTask} 
        onToggleTask={toggleTask} 
      />

      <Footer 
        total={tasks.length} 
        completed={completedTasks} 
        pending={pendingTasks} 
      />
    </div>
  );
}

export default App;