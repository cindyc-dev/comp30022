import React, { useState } from 'react';

export const TrelloBoard = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [inProgress, setInProgress] = useState<string[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTodos([...todos, newTask]);
      setNewTask('');
    }
  };

  const startProgress = (taskIndex) => {
    const taskToMove = todos[taskIndex];
    setTodos(todos.filter((_, index) => index !== taskIndex));
    setInProgress([...inProgress, taskToMove]);
  };

  const finishTask = (taskIndex) => {
    const taskToMove = inProgress[taskIndex];
    setInProgress(inProgress.filter((_, index) => index !== taskIndex));
    setDone([...done, taskToMove]);
  };

  return (
    <div className="flex flex-wrap justify-start gap-8">
      <div className="flex-1 card p-4 shadow bg-gray-100 w-96">
        <div className="card-body">
          <h1>Todo</h1>

          <div className="task-boxes">
            {todos.map((task, index) => (
              <div key={index} className="card bg-indigo-100 mb-2">
                <div className="card-body">
                  <h2>{task}</h2>
                  <button onClick={() => startProgress(index)}>Start</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="New Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>

          <div className="card-actions justify-between">
            <button className="btn btn-primary" onClick={addTask}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 card p-4 shadow w-96 bg-gray-100">
        <div className="card-body">
          <h1>In Progress</h1>

          <div className="task-boxes ">
            {inProgress.map((task, index) => (
              <div key={index} className="card bg-yellow-100 mb-2">
                <div className="card-body">
                  <h2>{task}</h2>
                  <button onClick={() => finishTask(index)}>Finish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 card p-4 shadow w-96 bg-gray-100">
        <div className="card-body">
          <h1>Done</h1>

          <div className="task-boxes">
            {done.map((task, index) => (
              <div key={index} className="card bg-green-100 mb-2">
                <div className="card-body">
                  <h2>{task}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrelloBoard;
