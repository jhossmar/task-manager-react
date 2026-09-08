import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState"; 

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// Declaramos qué datos está obligado a recibir este componente desde App.tsx
type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onToggleTask: (id: number) => void;
};

function TaskList({ tasks, onDeleteTask, onToggleTask }: TaskListProps) {
  // RENDERIZADO CONDICIONAL: Si el arreglo está vacío, detenemos la función aquí
  // y mostramos el componente de "No hay tareas"
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  // Si hay tareas, procedemos a dibujarlas en una lista ordenada
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id} // Requisito de React para saber qué elemento es cuál en el DOM
          task={task}
          onDeleteTask={onDeleteTask}
          onToggleTask={onToggleTask}
        />
      ))}
    </div>
  );
}

export default TaskList;