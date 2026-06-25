type Task={
    id: number;
    text: string;
    completed: boolean;
}

type TaskCardProps = {
    task: Task;
    onDeleteTask: (id: number) => void;
    onToggleTask: (id: number) => void;
}

function TaskCard(props: TaskCardProps) {
    return (
        <li className={props.task.completed ? "completed" : "task"}>
           <input
                type="checkbox"
                checked={props.task.completed}
                onChange={() => props.onToggleTask(props.task.id)}
            />

            <span>{props.task.text}</span>
            <button onClick={() => props.onDeleteTask(props.task.id)}>Eliminar</button>
        </li>
    );
}
export default TaskCard;