import React, { useState } from "react";
import { useToast } from "../hooks/toastContext";
import { useModal } from "../hooks/modalContext";
import { TaskI } from "~/types/TaskI";
import { api } from "~/utils/api";
import TaskDetailInputs from "./taskDetailsInputs";

interface AddTaskModalContentProps {
  status: string;
  refetch: () => void;
}

export const AddTaskModalContent = ({
  status,
  refetch,
}: AddTaskModalContentProps) => {
  const [newTask, setNewTask] = useState<TaskI>({
    id: "",
    title: "",
    description: "",
    status: status,
  });
  const [hasDueDate, setHasDueDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const mutation = api.trello.addTask.useMutation();
  const handleAddTask = () => {
    setIsLoading(true);
    if (!newTask.title) {
      // Show error toast if task name or status is empty
      addToast({
        type: "error",
        message: "Task name is required.",
      });
      return;
    }

    const addedTask = {
      title: newTask.title,
      description: newTask.description || "",
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString() : "",
      status: newTask.status,
    };

    mutation.mutate(addedTask, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: `Task (${newTask.title}) added successfully.`,
        });
        refetch();
        setNewTask({
          id: "",
          title: "",
          description: "",
          status: status,
        });
        closeModal(`add-task-modal-${status}`);
        setIsLoading(false);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: `Error adding task. Error:${error.message}`,
        });
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      <div className="relative mx-10 flex flex-col items-center gap-4">
        <h1 className="mt-0">Add Task</h1>
        <TaskDetailInputs
          task={newTask}
          setTask={setNewTask}
          hasDueDate={hasDueDate}
          setHasDueDate={(v) => {
            setHasDueDate(v);
            if (!v) setNewTask({ ...newTask, dueDate: undefined });
          }}
        />
        <button
          className={`btn btn-primary btn-wide ${
            ((hasDueDate && !newTask.dueDate) || !newTask.title || isLoading) &&
            "btn-disabled"
          }`}
          onClick={handleAddTask}
        >
          {isLoading ? (
            <span className="loading-spiner loading"></span>
          ) : (
            "Add Task"
          )}
        </button>
      </div>
    </>
  );
};

export default AddTaskModalContent;
