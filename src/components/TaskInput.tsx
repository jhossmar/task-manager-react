import {useState} from "react";
type TaskInputProps = {
    onAddTask: (text: string) => void;

}

function TaskInput(props: TaskInputProps) {
    const[text, setText] = useState("");
    const handleSubmit = () => {
    // Prevent adding empty tasks
    if (text.trim() === "") { 
        return; // Stop if there's no text
    }
    
    // This will now run successfully when there IS text
    props.onAddTask(text); 
    setText(""); 
};

    return(
        <div className="task-input">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Agregar una nueva tarea"
            />
            <button onClick={handleSubmit}>Agregar</button>
        </div>
    )
}
export default TaskInput;