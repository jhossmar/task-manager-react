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
        <div>
            <input
                type="text"
                placeholder="Escribir una nueva tarea"
                value={text}
                onChange={(event) => setText(event.target.value)}
            />
            <button onClick={handleSubmit}>
                Add
            </button>
        </div>
    )
}
export default TaskInput;