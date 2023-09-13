import React, { useState } from 'react';


type TaskColumn = 'todo' | 'inProgress' | 'done';

interface Tasks {
  todo: string[];
  inProgress: string[];
  done: string[];
}

function Board() {
  const [tasks, setTasks] = useState<Tasks>({
    todo: ['Task 1', 'Task 2', 'Task 3'],
    inProgress: ['Task 4', 'Task 5'],
    done: ['Task 6', 'Task 7'],
  });

  const [newTask, setNewTask] = useState<string>('');

  const handleAddTask = (column: TaskColumn) => {
    if (newTask.trim() === '') return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [column]: [...prevTasks[column], newTask],
    }));

    setNewTask('');
  };

  const handleDeleteTask = (column: TaskColumn, taskIndex: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[column].splice(taskIndex, 1);
      return updatedTasks;
    });
  };

  return (
    <div className="board">
      <div className="column">
        <h2>To Do</h2>
        <div className="task-list">
          {tasks.todo.map((task, index) => (
            <div className="task" key={index}>
              <span>{task}</span>
              <button onClick={() => handleDeleteTask('todo', index)}>Delete</button>
            </div>
          ))}
        </div>
        <div className="add-task">
          <input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={() => handleAddTask('todo')}>Add Task</button>
        </div>
      </div>
      <div className="column">
        <h2>In Progress</h2>
        <div className="task-list">
          {tasks.inProgress.map((task, index) => (
            <div className="task" key={index}>
              <span>{task}</span>
              <button onClick={() => handleDeleteTask('inProgress', index)}>Delete</button>
            </div>
          ))}
        </div>
        <div className="add-task">
          <input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={() => handleAddTask('inProgress')}>Add Task</button>
        </div>
      </div>
      <div className="column">
        <h2>Done</h2>
        <div className="task-list">
          {tasks.done.map((task, index) => (
            <div className="task" key={index}>
              <span>{task}</span>
              <button onClick={() => handleDeleteTask('done', index)}>Delete</button>
            </div>
          ))}
        </div>
        <div className="add-task">
          <input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={() => handleAddTask('done')}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

export default Board;
