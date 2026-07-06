import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string; 
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // Authentication states safely initialized
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // 1. CARGAR TAREAS (Solo si hay un token válido)
  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        // Ensure data is actually an array before setting state to avoid crashes
        if (response.ok && Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("Backend did not return an array:", data);
          handleLogout(); // Clear bad tokens gracefully
        }
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };
    fetchTasks();
  }, [token]);

  // 2. MANEJAR INICIO DE SESIÓN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        setLoginError(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setLoginError("Error al conectar con el servidor");
    }
  };

  // 3. CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
  };

  // 4. MÉTODOS DE TAREAS
  const addTask = async (text: string) => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const deleteTask = (id: number) => {
    fetch(`http://localhost:3000/tasks/${id}`, { 
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar");
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error(error));
  };

  const toggleTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, { 
        method: "PUT", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        } 
      });
      if (!response.ok) throw new Error("Error al actualizar");
      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error(error);
    }
  };

  // Safe checks to avoid filtering undefined properties
  const completedTasks = Array.isArray(tasks) ? tasks.filter((task) => task.completed).length : 0;
  const pendingTasks = Array.isArray(tasks) ? tasks.length - completedTasks : 0;

  // --- VISTA DE LOGIN ---
  if (!token) {
    return (
      <div className="app-container login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input 
            type="email" 
            placeholder="admin@test.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="123456" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {loginError && <p className="error-message">{loginError}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // --- VISTA PRINCIPAL (TASK MANAGER) ---
  return (
    <div className="app-container">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <Header />
      <TaskInput onAddTask={addTask} />
      <TaskList tasks={tasks} onDeleteTask={deleteTask} onToggleTask={toggleTask} />
      <Footer total={tasks.length} completed={completedTasks} pending={pendingTasks} />
    </div>
  );
}

export default App;