import React, { useState } from "react";
import { useModal } from "../../components/hooks/modalContext";
import { TaskI } from "~/types/TaskI";
import { set } from "zod";


const EditTaskModalContent = ({ task, onUpdateTask }) => {
  const { closeModal } = useModal();
  const [newTask, setNewTask] = useState<TaskI>({ id: task.id, title: task.title, description: task.description, status: task.status});

  const handleTitleChange = (e) => {
    setNewTask({ ...newTask, title: e.target.value});
  };

  const handleDescriptionChange = (e) => {
    setNewTask({ ...newTask, description: e.target.value});
  };

  const handleUpdateClick = () => {
    // Here, you can call the onUpdateTask function to update the task with new details.
    console.log("Handling");
    onUpdateTask(newTask);

    // Close the modal after updating the task.
    closeModal("edit-task-modal");
  };

  return (
    <>
      <div className = "relative flex flex-col items-center gap-4 mx-10">
        <h1 className = "mt-0">Edit Task</h1>
        <div className = "flex w-full flex-col">
          <label>Task Name:</label>
          <input className = "input input-bordered w-full" type="text" value={newTask.title} onChange={handleTitleChange} />
        </div>
        <div className = "flex w-full flex-col">
          <label>Description:</label>
          <textarea className = "input input-bordered w-full" value={newTask.description} onChange={handleDescriptionChange} />
        </div>
        <button className = "btn btn-primary btn-wide" onClick={handleUpdateClick}>Update Task</button>
      </div>
    </>

  );
};

export default EditTaskModalContent;