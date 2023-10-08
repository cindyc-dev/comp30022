import React, { useState } from "react";
import { useModal } from "../../components/hooks/modalContext";
import { TaskI } from "~/types/TaskI";

interface EditTaskModalContentProps {
  task: TaskI;
  onUpdateTask: (newTask: TaskI) => void;
}

const EditTaskModalContent = ({
  task,
  onUpdateTask,
}: EditTaskModalContentProps) => {
  const { closeModal } = useModal();
  const [newTask, setNewTask] = useState<TaskI>({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
  });

  const handleTitleChange = (e: { target: { value: any; }; }) => {
    setNewTask({ ...newTask, title: e.target.value });
  };

  const handleDescriptionChange = (e: { target: { value: any; }; }) => {
    setNewTask({ ...newTask, description: e.target.value });
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
      <div className="relative mx-10 flex flex-col items-center gap-4">
        <h1 className="mt-0">Edit Task</h1>
        <div className="flex w-full flex-col">
          <label>Task Name:</label>
          <input
            className="input input-bordered w-full"
            type="text"
            value={newTask.title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="flex w-full flex-col">
          <label>Description:</label>
          <textarea
            className="input input-bordered w-full"
            value={newTask.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <button
          className="btn btn-primary btn-wide"
          onClick={handleUpdateClick}
        >
          Update Task
        </button>
      </div>
    </>
  );
};

export default EditTaskModalContent;
