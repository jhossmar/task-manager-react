//import { useState } from "react";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import "./App.css";
import { useEffect, useState } from "react";




type Task = {
    id: number;
    text: string;
    completed: boolean;
};

function App() {
    // const [tasks, setTasks] = useState<Task[]>([
    //     { id: 1, text: "Estudiar React", completed: false },
    //     { id: 2, text: "Practicar TypeScript", completed: false },
    //     { id: 3, text: "Entender estado", completed: true }
    // ]);
    // 1. Initialize state as an empty array (it will load from backend)
    const [tasks, setTasks] = useState<Task[]>([]);
    // 2. Fetch tasks from backend correctly inside the component
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("http://localhost:3000/tasks");
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    // const addTask = (text: string) => {
    //     const newTask: Task = {
    //         id: Date.now(),
    //         text: text,
    //         completed: false
    //     };
    //     setTasks([...tasks, newTask]);
    // };

 // NEW CHANGE: addTask now sends the new task to the backend using POST.
const addTask = async (text: string) => {
    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text
        })
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
};

    // const deleteTask = (id: number) => {
    //     const updatedTasks = tasks.filter((task) => task.id !== id);
    //     setTasks(updatedTasks);
    // };
    // NEW CHANGE: deleteTask now deletes the task from the backend using DELETE
const deleteTask = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            // Only update local UI state if the backend successfully deleted it
            const updatedTasks = tasks.filter((task) => task.id !== id);
            setTasks(updatedTasks);
        } else {
            console.error("Failed to delete the task on the server.");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

    const toggleTask = async (id: number) => {
        try{
            const updatedTasks = tasks.map((task) => {
                if (task.id === id) {
                    return {
                        ...task,
                        completed: !task.completed
                    };
            }
            return task;
        });
        setTasks(updatedTasks);
       }catch (error) {
        console.error("Error toggling task:", error);

       }

    };

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