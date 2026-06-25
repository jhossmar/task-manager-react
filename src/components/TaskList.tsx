import TaskCard from "./TaskCard";
import EmptyList from "./EmptyState";


type Task={
   id: number;
    text: string;
    completed: boolean;
}

type TaskListProps = {
    tasks: Task[];
    onDeleteTask: (id: number) => void;
    onToggleTask: (id: number) => void;
}


function TaskList(props: TaskListProps) {

    if (props.tasks.length === 0) {
        return <EmptyList />;
    }
    return (
        <ul>
            {
                props.tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onDeleteTask={props.onDeleteTask}
                    onToggleTask={props.onToggleTask}
                />
            ))
            }
        </ul>
    );

}
export default TaskList;