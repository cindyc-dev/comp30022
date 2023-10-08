import React, { useState } from "react";
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

  const onUpdateTask = ( newTask: TaskI ) => {
    console.log("Updating");

    // onUpdateTask(editedTask: TaskI, prevTitle)
    // Find for the task using id/prevTitle
    // Replace with new 

    // TODO call backend for updating task
    // setNewTask({ title: title, description: description, status: task.status });
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

  // change for task ID
  const deleteTask = (columnId: string, taskIndex: number) => {
    setColumns((prevColumns) => {
      const updatedColumn = { ...prevColumns[columnId] };
      updatedColumn.items.splice(taskIndex, 1);
      return {
        ...prevColumns,
        [columnId]: updatedColumn,
      };
    });
  };

  



  return (
    <div className="flex w-full flex-col">
      
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
                                <div className="card-body" >
                                  <h2 onClick={() => handleEditTask(task)}>{task.title}</h2>
                                  <p>{task.description}</p>
                                  <button
                                    className="btn-danger btn"
                                    onClick={() => deleteTask(columnId, index)}
                                  >
                                    Delete
                                  </button>
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