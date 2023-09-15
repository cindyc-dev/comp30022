import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Define the Task type with description and date fields
type Task = {
  title: string;
  description: string;
  date: string;
};

export const TrelloBoard = () => {
  const initialColumns = {
    todos: {
      title: 'Todo',
      items: [] as Task[],
    },
    inProgress: {
      title: 'In Progress',
      items: [] as Task[],
    },
    done: {
      title: 'Done',
      items: [] as Task[],
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result: any) => {
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
    updatedDestinationItems.splice(destination.index, 0, draggableId as string);
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
  

  const addTask = () => {
    if (newTask.trim() !== '') {
      setColumns((prevColumns) => ({
        ...prevColumns,
        todos: {
          ...prevColumns.todos,
          items: [...prevColumns.todos.items, newTask],
        },
      }));
      setNewTask('');
    }
  };

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

  const [newTask, setNewTask] = useState('');

  return (
    <div className="flex justify-start flex-wrap my-10 gap-8">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(columns).map((columnId) => {
          const column = columns[columnId];
          return (
            <div key={columnId} className="flex-1 card p-4 shadow bg-gray-100 w-96">
              <div className="card-body">
                <h1>{column.title}</h1>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="task-boxes"
                    >
                      {column.items.map((task: string, index: number) => (
                        <Draggable
                          key={task}
                          draggableId={task} // Ensure task is a string
                          index={index}
                        >
                          {(provided) => (
                            
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              
                              
                              
                              className="card shadow bg-indigo-100 mb-2"
                            >
                              <div className="card-body">
                                <h2>{task}</h2>
                                <button
                                    className="btn btn-danger"
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
                {column.title === 'Todo' && (
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="New Task"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                  </div>
                )}
                {column.title === 'Todo' && (
                  <div className="card-actions justify-between">
                    <button className="btn btn-primary" onClick={addTask}>
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default TrelloBoard;
