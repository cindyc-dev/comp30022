import React, { useState } from "react";
import { useToast } from "../../components/hooks/toastContext";
import { useModal } from "../../components/hooks/modalContext";

export const AddTaskModalContent = () => {
  const [newTask, setNewTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const handleAddTask = () => {
    if (!newTask) {
      // Show error toast if task name is empty
      addToast({
        type: "error",
        message: "Task name is required.",
      });
      return;
    }

    // Replace the following lines with your logic to add the task
    console.log("Task Name:", newTask);
    console.log("Description:", description);
    console.log("Date:", date);

    // Optionally, you can reset the form fields here
    setNewTask("");
    setDescription("");
    setDate("");

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
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
