import {
  createTask,
  deleteTask,
  getTasks,
  renewTask,
} from "../Repositories/TrelloRepository";
import { TaskInfoPayload } from "../Repositories/TrelloRepository";

export async function setTask(
  createdById: string,
  title: string,
  description: string,
  dueDate: string,
  status: string
): Promise<boolean> {
  const task = await createTask(
    createdById,
    title,
    description,
    dueDate,
    status
  );
  return task ? true : false;
}

export async function removeTask(userId: string, id: string): Promise<boolean> {
  const remove = await deleteTask(userId, id);
  return remove ? true : false;
}

export async function updateTask(
  userId: string,
  id: string,
  title: string,
  description: string,
  dueDate: string,
  status: string
): Promise<boolean> {
  const update = await renewTask(userId, id, title, description, dueDate, status);
  return update ? true : false;
}

export async function fetchTasks(
  createdById: string
): Promise<TaskInfoPayload[] | null> {
  const tasks = await getTasks(createdById);
  return tasks;
}