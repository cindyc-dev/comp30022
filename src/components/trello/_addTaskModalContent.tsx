import React, { useState } from "react";
import { useToast } from "../hooks/toastContext";
import { useModal } from "../hooks/modalContext";
import { TaskI } from "~/types/TaskI";
import { ColumnI } from "~/types/ColumnI";
import { api } from "~/utils/api";
import TextInput from "../common/textInput";
import TextAreaInput from "../common/textAreaInput";
import TaskDetailInputs from "./taskDetailsInputs";

interface AddTaskModalContentProps {
  refetch: () => void;
}

export const AddTaskModalContent = ({
  refetch
}: AddTaskModalContentProps) => {
  const [newTask, setNewTask] = useState<TaskI>({
    id: "",
    title: "",
    description: "",
    status: "",
  });
  const [hasDueDate, setHasDueDate] = useState(false);
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const mutation = api.trello.addTask.useMutation();
  const handleAddTask = () => {
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
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: `Error adding task. Error:${error.message}`,
        });
      },
    });

    setNewTask({
      id: "",
      title: "",
      description: "",
      status: "",
    });

    refetch();

    closeModal("add-task-modal");
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
            ((hasDueDate && !newTask.dueDate) || !newTask.title) &&
            "btn-disabled"
          }`}
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
    </>
  );
};

export default AddTaskModalContent;
