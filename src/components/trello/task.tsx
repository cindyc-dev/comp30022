import moment from "moment";
import { Draggable } from "react-beautiful-dnd";
import { TaskI } from "~/types/TaskI";

interface TaskProps {
  task: TaskI;
  index: number;
  handleEditTask: (task: TaskI) => void;
}

function Task({ task, index, handleEditTask }: TaskProps) {
  return (
    <Draggable draggableId={task.title} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card mb-2 bg-secondary shadow"
        >
          <div
            className="card-body m-0 flex flex-col gap-0 p-5"
            onClick={() => handleEditTask(task)}
          >
            <p className="m-0 text-lg font-bold">{task.title}</p>
            {task.dueDate && (
              <p className="m-0 text-sm">
                {moment(task.dueDate).format("DD/MM/YYYY")}
              </p>
            )}
            {task.description && <p className="m-0 mt-3">{task.description}</p>}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Task;
