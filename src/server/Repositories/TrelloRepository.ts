import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  dueDate: true,
  createdById: true,
  status: true,
} satisfies Prisma.TaskSelect;

export async function createTask(createdById: string, title: string, description: string, dueDate: string, status: string) {

  const task = await prisma.task.create({
    data: {
      createdById: createdById,
      title: title,
      description: description,
      dueDate: dueDate,
      status: status
    },
  });

  // const taskId = task.id; 

  return task;
}

export async function deleteTask(id: string) {
  const deletion = await prisma.task.delete({
    where: {
      id: id,
    }
  });
  return deletion;
}

export async function renewTask(id: string, title: string, description: string, dueDate: string) {
  const update = await prisma.task.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      description: description,
      dueDate: dueDate
    },
  });
  return update;
}

export type TaskInfoPayload = Prisma.UserGetPayload<{ select: typeof taskSelect }>;

export async function getTasks(
  createdById: string,
): Promise<TaskInfoPayload | null> {
  const dbResult = await prisma.task.findMany({
    where: {
      createdById: createdById,
    },
    select: taskSelect,
  });

  if (!dbResult) {
    return null;
  }
  return dbResult;
}