import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { tryCatchWrapper } from "~/utils/tryCatchWrapper";


const taskSelect = {
  id: true,
  title: true,
  description: true,
  dueDate: true,
  createdById: true,
  status: true,
} satisfies Prisma.TaskSelect;

export async function createTask(
  createdById: string,
  title: string,
  description: string,
  dueDate: string,
  status: string
) {
  return await tryCatchWrapper(async () => {
    const task = await prisma.task.create({
      data: {
        createdById: createdById,
        title: title,
        description: description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status,
      },
    });
    return task;
  }, "Error creating task.");
}

export async function deleteTask(userId: string, id: string) {

  return await tryCatchWrapper(async () => {

    await prisma.task.delete({
      where: {
        id: id,
        createdById: userId,
      },
    });
    return true;
  }, "Error deleting task.");
}

export async function renewTask(
  userId: string,
  id: string,
  title: string,
  description: string,
  dueDate: string,
  status: string
) {
  const update = await prisma.task.update({
    where: {
      createdById: userId,
      id: id,
    },
    data: {
      title: title,
      description: description,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status,
    },
  });
  return update;
}

export type TaskInfoPayload = Prisma.TaskGetPayload<{
  select: typeof taskSelect;
}>;

export async function getTasks(
  createdById: string
): Promise<TaskInfoPayload[] | null> {
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