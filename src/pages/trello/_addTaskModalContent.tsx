import React, { useState } from "react";
import { useToast } from "../../components/hooks/toastContext";
import { useModal } from "../../components/hooks/modalContext";
import { TaskI } from "~/types/TaskI";
import { ColumnI } from "~/types/ColumnI";
import { set } from "zod";

interface AddTaskModalContentProps {
  column: Record<string, ColumnI>, 
  setColumns: React.Dispatch<React.SetStateAction<Record<string, ColumnI>>>
}

export const AddTaskModalContent = ({column,setColumns}:AddTaskModalContentProps) => {
  const [newTask, setNewTask] = useState<TaskI>({ id: "", title: "", description: "", status: ""});
  const [date, setDate] = useState<string>("");
  const { addToast } = useToast();
  const { closeModal } = useModal();


  const handleAddTask = () => {
    // Generating random id for task
    const newColumns = {...column};
    if (!newTask.title) {
      // Show error toast if task name or status is empty
      addToast({
        type: "error",
        message: "Task name is required.",
      });
      return;
    }

    console.log(newTask);

    newColumns.todos.items.push(newTask);
    setColumns({...newColumns});


    addToast({
      type: "success",
      message: "Task added successfully.",
    });

    // Optionally, you can reset the form fields here
    setNewTask({ id: "", title: "", description: "", status: "" });

    closeModal("add-task-modal");
  };

  return (
    <>
      <div className="relative flex flex-col items-center gap-4 mx-10">
        <h1 className="mt-0">Add Task</h1>
        <div className= "flex w-full flex-col">
          <label htmlFor="taskName">Task Name*</label>
          <input 
            className="input input-bordered w-full"
            type="text"
            id="taskName"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value, status: "Todo", id: Math.random().toString(36).substring(7)})}
          />
        </div>
        <div className="flex w-full flex-col">
          <label htmlFor="description">Description</label>
          <textarea
            className="input input-bordered w-full"
            id="description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </div>
        <div className="flex w-full flex-col">
          <label htmlFor="date">Date</label>
          <input
            className="input input-bordered w-full"
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
