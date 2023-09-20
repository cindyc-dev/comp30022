import { createTask, deleteTask, getTasks } from "../Repositories/TrelloRepository";


export async function setTask(createdById: string, title: string, description: string, dueDate: string): Promise<boolean> {
  const task = await createTask(createdById, title, description, dueDate);
  return task ? true : false;
}

export async function removeTask(id: number): Promise<boolean> {
  const remove = await deleteTask(id);
  return remove ? true : false;
}

export async function updateTask(id: number, title: string, description: string, dueDate: string): Promise<boolean> {
  const update = await updateTask(id, title, description, dueDate);
  return update ? true : false;
}

export async function fetchTasks(createdById: string): Promise<TaskInfoPayload> {
  const tasks = await getTasks(createdById);
  return tasks;
}