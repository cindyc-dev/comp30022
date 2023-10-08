import React, { useState } from "react";
import { useModal } from "../../components/hooks/modalContext";
import { TaskI } from "~/types/TaskI";
import { api } from "~/utils/api";

interface EditTaskModalContentProps {
  task : TaskI,
  onUpdateTask : (newTask : TaskI) => void
}

const EditTaskModalContent = ({ task, onUpdateTask } : EditTaskModalContentProps ) => {
  const { closeModal } = useModal();
  const [newTask, setNewTask] = useState<TaskI>({ id: task.id, title: task.title, description: task.description, status: task.status, dueDate: task.dueDate});

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

  const mutation = api.trello.deleteTask.useMutation();
  // change for task ID
  const deleteTask = (deletedTask : TaskI) => {
    mutation.mutate({ id: deletedTask.id }, {
      onSuccess: () => {
        console.log("Deleted");
        refetch();
        closeModal("edit-task-modal");
      },
      onError: (error) => {
        console.log(error);
      }
    });
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
        <div className="flex w-full flex-col">
          <label htmlFor="date">Date</label>
          <input
            className="input input-bordered w-full"
            type="date"
            id="date"
            value={newTask.dueDate.toISOString().split("T")[0]}
            onChange={(e) => {
              setNewTask({ ...newTask, dueDate: new Date(e.target.value) });
              
            }}
          />
        </div>
        <button className = "btn btn-primary btn-wide" onClick={handleUpdateClick}>Update Task</button>
        <button className="btn-danger btn"onClick={() => deleteTask(task)}>Delete</button>
      </div>
    </>

  );
};

export default EditTaskModalContent;