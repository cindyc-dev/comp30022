import { z } from "zod";
import {fetchTasks, removeTask, updateTask} from "~/server/Services/TrelloService";
import { setTask } from "~/server/Services/TrelloService";
import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";

export const trelloRouter = createTRPCRouter({

  addTask: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        dueDate: z.string(),
        status: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;
      await setTask(
        userId,
        opts.input.title,
        opts.input.description,
        opts.input.dueDate,
        opts.input.status
      );
    }),

  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;
      await removeTask(userId, opts.input.id);
    }),
  
  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        dueDate: z.string(),
        status: z.string()
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;
      await updateTask(userId, opts.input.id, opts.input.title, opts.input.description, opts.input.dueDate, opts.input.status);
    }),

  getTask: protectedProcedure
    .query(async (opts) => {
      return fetchTasks(opts.ctx.session.user.id);
    }),


});