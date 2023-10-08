import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { ColumnI } from "~/types/ColumnI";
import { TaskI } from "~/types/TaskI";
import { useModal } from "~/components/hooks/modalContext";
import { AddTaskModalContent } from "./_addTaskModalContent";
import { FaPlusCircle } from "react-icons/fa";
import EditTaskModalContent from "./_editTaskModalContent";
import { api } from "~/utils/api";
import moment from "moment";

export const Board = () => {
  const initialColumns: Record<string, ColumnI> = {
    todos: {
      title: "To do",
      items: [],
    },
    inProgress: {
      title: "In Progress",
      items: [],
    },
    done: {
      title: "Done",
      items: [],
    },
  };

  const { openModal } = useModal();
  const [columns, setColumns] = useState(initialColumns);

  const { data, isLoading, error, refetch } = api.trello.getTask.useQuery();
  useEffect(() => {
    if (data) {
      const newColumns = { ...columns };
      const newTasks: TaskI[] = data.map((task) => {
        const newT: TaskI = {
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          dueDate: task.dueDate || undefined,
          status: task.status,
        };
        return newT;
      });
      console.log({ newTasks: newTasks });
      console.log({ newColumns: newColumns });
      newColumns.todos.items = newTasks.filter(
        (task) => task.status === "Todo"
      );
      newColumns.inProgress.items = newTasks.filter(
        (task) => task.status === "inProgress"
      );
      newColumns.done.items = newTasks.filter((task) => task.status === "done");
      setColumns({ ...newColumns });
    }
  }, [data, error]);

  const handleAddTask = () => {
    openModal({
      content: <AddTaskModalContent refetch={refetch} />,
      id: "add-task-modal",
    });
  };

  const handleEditTask = (task: TaskI) => {
    openModal({
      content: <EditTaskModalContent task={task} refetch={refetch} />,
      id: "edit-task-modal",
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If the item was not dropped in a valid droppable destination
    if (!destination) return;

    // If the item was dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Remove the item from the source column
    const sourceColumn = columns[source.droppableId];
    const updatedSourceItems = [...sourceColumn.items];
    updatedSourceItems.splice(source.index, 1);
    const updatedSourceColumn = {
      ...sourceColumn,
      items: updatedSourceItems,
    };

    // Add the item to the destination column
    const destinationColumn = columns[destination.droppableId];
    const updatedDestinationItems = [...destinationColumn.items];
    const draggedTask = sourceColumn.items.find(
      (item: TaskI) => item.title === draggableId
    ) as TaskI;
    draggedTask.status = destination.droppableId;

    onUpdateTask(draggedTask);

    updatedDestinationItems.splice(destination.index, 0, draggedTask);
    const updatedDestinationColumn = {
      ...destinationColumn,
      items: updatedDestinationItems,
    };

    // Update the state with the new column data
    setColumns({
      ...columns,
      [source.droppableId]: updatedSourceColumn,
      [destination.droppableId]: updatedDestinationColumn,
    });
  };

  return (
    <div className="my-5 mb-0 mt-4 flex w-full flex-col">
      <button className="btn btn-primary" onClick={handleAddTask}>
        <FaPlusCircle />
        Add Task
      </button>
      {isLoading && (
        <div className="my-4 flex w-full justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}
      {!isLoading && (
        <div className="my-10 flex flex-wrap justify-center gap-8">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.keys(columns).map((columnId) => {
              const column = columns[columnId];
              return (
                <div key={columnId}>
                  <h2 className="m-0 mx-6 my-4">
                    {column.title}{" "}
                    <span className="text-gray-400">{column.items.length}</span>
                  </h2>
                  <div
                    key={columnId}
                    className="card w-96 flex-1 bg-gray-100 p-4 shadow"
                  >
                    <div className="card-body">
                      <Droppable droppableId={columnId}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="task-boxes"
                          >
                            {column.items.map((task: TaskI, index: number) => (
                              <Draggable
                                key={task.title}
                                draggableId={task.title}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="card mb-2 bg-secondary shadow"
                                  >
                                    <div
                                      className="card-body m-0 p-5"
                                      onClick={() => handleEditTask(task)}
                                    >
                                      <h3 className="m-0">{task.title}</h3>
                                      {task.dueDate && (
                                        <p className="m-0">
                                          {moment(task.dueDate).format(
                                            "DD/MM/YYYY"
                                          )}
                                        </p>
                                      )}
                                      <p className="m-0">{task.description}</p>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default Board;
