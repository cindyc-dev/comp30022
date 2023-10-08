import React, { use, useEffect, useState } from "react";
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


export const Board = () => {
  const initialColumns: Record<string, ColumnI> = {
    todos: {
      title: "Todo",
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


  const handleAddTask = () => {
    openModal({
      content: <AddTaskModalContent column={columns} setColumns={setColumns} />,
      id: "add-task-modal",
    });
  };

  const mutation = api.trello.updateTask.useMutation();
  const onUpdateTask = ( newTask : TaskI ) => {
    console.log("Updating");
    console.log(newTask);

    const updatedTask = {
      id : newTask.id,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate.toISOString(),
      status: newTask.status,
    };

    mutation.mutate(updatedTask, {
      onSuccess: () => {
        console.log("Updated");
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const handleEditTask = (task: TaskI) => {
    console.log("editing");
    openModal({
      content: (
        <EditTaskModalContent
          task = {task}
          onUpdateTask={onUpdateTask}
        />
      ),
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
    <div className="flex w-full flex-col mb-0 mt-4 my-5">
      <button className="btn btn-primary" onClick={handleAddTask}>
        <FaPlusCircle />
        Add Task
      </button>

      <div className="my-10 flex flex-wrap justify-start gap-8">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(columns).map((columnId) => {
            const column = columns[columnId];
            return (
              <div
                key={columnId}
                className="card w-96 flex-1 bg-gray-100 p-4 shadow"
              >
                <div className="card-body">
                  <h1>{column.title}</h1>
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
                                className="card mb-2 bg-indigo-100 shadow"
                              >
                                <div className="card-body" onClick={() => handleEditTask(task)} >
                                  <h2>{task.title}</h2>
                                  <p>{task.description}</p>
                                  <p>{task.dueDate.toDateString()}</p>
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
            );
          })}
        </DragDropContext>
      </div>

    </div>
      
  );
};

export default Board;
