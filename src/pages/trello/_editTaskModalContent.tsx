import React, { useState } from "react";
import { useModal } from "../../components/hooks/modalContext";


const EditTaskModalContent = ({ task, onUpdateTask }) => {
  const { closeModal } = useModal();
  const [currentTaskTitle, setCurrentTaskTitle] = useState(task.title);
  const [currentTaskDescription, setCurrentTaskDescription] = useState(task.description);

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
      <div>
        <h2>Edit Task</h2>
        <div>
          <label>Title:</label>
          <input type="text" value={currentTaskTitle} onChange={handleTitleChange} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={currentTaskDescription} onChange={handleDescriptionChange} />
        </div>
        <button onClick={handleUpdateClick}>Update Task</button>
      </div>
    </>
    
  );
};

export default EditTaskModalContent;
