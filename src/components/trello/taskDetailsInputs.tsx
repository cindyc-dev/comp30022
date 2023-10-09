import React from "react";
import TextAreaInput from "../common/textAreaInput";
import TextInput from "../common/textInput";
import { TaskI } from "~/types/TaskI";

interface TaskDetailInputsProps {
  task: TaskI;
  setTask: React.Dispatch<React.SetStateAction<TaskI>>;
  hasDueDate: boolean;
  setHasDueDate: (v: boolean) => void;
}

const TaskDetailInputs = ({
  task,
  setTask,
  hasDueDate,
  setHasDueDate,
}: TaskDetailInputsProps) => {
  return (
    <div className="flex w-full flex-col justify-start gap-2">
      <TextInput
        label="🖊️ Task Name"
        value={task.title}
        setValue={(v) => setTask({ ...task, title: v })}
        placeholder="eg. Send email to client"
        required
      />
      <TextAreaInput
        label="✏️ Description"
        value={task.description || ""}
        setValue={(v) => setTask({ ...task, description: v })}
        placeholder="eg. Email about the new feature to the client..."
      />
      <div className="flex gap-4">
        <label className="label flex min-w-fit cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            checked={hasDueDate}
            className="checkbox-primary checkbox"
            onChange={(e) => setHasDueDate(e.target.checked)}
          />
          <span className="label-text">Add Due Date</span>
        </label>
        {hasDueDate && (
          <div className="flex w-full flex-col">
            <label htmlFor="date" className="label-text">
              📅 Date
            </label>
            <input
              className="input input-bordered w-full"
              type="date"
              id="date"
              value={task.dueDate?.toISOString().split("T")[0]}
              onChange={(e) => {
                setTask({ ...task, dueDate: new Date(e.target.value) });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailInputs;
