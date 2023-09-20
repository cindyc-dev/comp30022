import React, { useState } from "react";
import { useToast } from "../../components/hooks/toastContext";
import { useModal } from "../../components/hooks/modalContext";
import { TaskI } from "~/types/TaskI";



export const AddTaskModalContent = ({column,setColumns}) => {
  const [newTask, setNewTask] = useState<TaskI>({ title: "", description: "", status: "" });
  const [date, setDate] = useState<string>("");
  const { addToast } = useToast();
  const { closeModal } = useModal();


  const handleAddTask = () => {
    const newColumns = {...column};
    if (!newTask.title) {
      // Show error toast if task name or status is empty
      addToast({
        type: "error",
        message: "Task name and status are required.",
      });
      return;
    }

    newColumns.todos.items.push(newTask);
    setColumns({...newColumns});

    // // Create a copy of the tasks array with the new task added
    // const updatedTasks = [...tasks, newTask];

    // // Update the tasks state with the updated array
    // setTasks(updatedTasks);

    // Replace the following lines with your logic to add the task
    console.log("Task Name:", newTask.title);
    console.log("Description:", newTask.description);
    console.log("Date:", date);

    addToast({
      type: "success",
      message: "Task added successfully.",
    });

    // Optionally, you can reset the form fields here
    setNewTask({ title: "", description: "", status: "" });

    closeModal("add-task-modal");
  };

  return (
    <>
    
      <div className="relative flex flex-col items-center gap-4">
        <h1 className="mt-0">Add Task</h1>
        <div>
          <label htmlFor="taskName">Task Name:</label>
          <input
            type="text"
            id="taskName"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-wide" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
    </>
  );
};



export default AddTaskModalContent;
