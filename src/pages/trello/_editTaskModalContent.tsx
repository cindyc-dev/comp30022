import React, { useState } from "react";
import { useModal } from "../../components/hooks/modalContext";


const EditTaskModalContent = ({ task, onUpdateTask }) => {
  const { closeModal } = useModal();
  const [currentTaskTitle, setCurrentTaskTitle] = useState(task.title);
  const [currentTaskDescription, setCurrentTaskDescription] = useState(task.description);
  const [currentDate, setCurrentDate] = useState(task.dueDate);

  const handleTitleChange = (e) => {
    setCurrentTaskTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setCurrentTaskDescription(e.target.value);
  };

  const handleUpdateClick = () => {
    // Here, you can call the onUpdateTask function to update the task with new details.
    console.log("Handling", currentTaskTitle);
    onUpdateTask(currentTaskTitle, currentTaskDescription, task);

    // Close the modal after updating the task.
    closeModal("edit-task-modal");
  };

  return (
    <>
      <div className = "relative flex flex-col items-center gap-4 mx-10">
        <h1 className = "mt-0">Edit Task</h1>
        <div className = "flex w-full flex-col">
          <label>Task Name</label>
          <input className = "input input-bordered w-full" type="text" value={currentTaskTitle} onChange={handleTitleChange} />
        </div>
        <div className = "flex w-full flex-col">
          <label>Description:</label>
          <textarea className = "input input-bordered w-full" value={currentTaskDescription} onChange={handleDescriptionChange} />
        </div>
        <div className="flex w-full flex-col">
          <label htmlFor="date">Date</label>
          <input
            className="input input-bordered w-full"
            type="date"
            id="date"
            value = {currentDate}
          />
        </div>
        <button className = "btn btn-primary btn-wide" onClick={handleUpdateClick}>Update Task</button>
      </div>
    </>
    
  );
};

export default EditTaskModalContent;
