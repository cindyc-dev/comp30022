import React, { useState } from "react";
import { useModal } from "../hooks/modalContext";
import { TaskI } from "~/types/TaskI";
import { api } from "~/utils/api";
import TaskDetailInputs from "./taskDetailsInputs";
import { useToast } from "../hooks/toastContext";
import { FaSave, FaTrash } from "react-icons/fa";
import { isObjectsEqual } from "../utils/isObjectEqual";

interface EditTaskModalContentProps {
  task: TaskI;
  refetch: () => void;
  onUpdateTask: (t: TaskI) => void;
}

const EditTaskModalContent = ({
  task,
  refetch,
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
  const [hasDueDate, setHasDueDate] = useState(task.dueDate ? true : false);
  const { addToast } = useToast();

  const mutation = api.trello.deleteTask.useMutation();
  // change for task ID
  const deleteTask = (deletedTask: TaskI) => {
    mutation.mutate(
      { id: deletedTask.id },
      {
        onSuccess: () => {
          addToast({
            message: `Task "${deletedTask.title}" was deleted`,
            type: "success",
          });
          refetch();
          closeModal("edit-task-modal");
        },
        onError: (error) => {
          console.log(error);
          addToast({
            message: `Task "${deletedTask.title}" was not deleted`,
            type: "error",
          });
        },
      }
    );
  };

  return (
    <>
      <div className="relative mx-10 flex flex-col items-center gap-4">
        <h1 className="mt-0">Edit Task</h1>
        <TaskDetailInputs
          task={newTask}
          setTask={setNewTask}
          hasDueDate={hasDueDate}
          setHasDueDate={(v) => {
            setHasDueDate(v);
            if (!v) setNewTask({ ...newTask, dueDate: undefined });
          }}
        />
        <div className="flex w-full justify-end gap-4">
          <button className="btn btn-error" onClick={() => deleteTask(task)}>
            <FaTrash />
            Delete
          </button>
          <button
            className={`btn btn-primary ${
              (isObjectsEqual(task, newTask) || !newTask.title) && "btn-disabled"
            }`}
            onClick={() => onUpdateTask(newTask)}
          >
            <FaSave />
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default EditTaskModalContent;
