import { z } from "zod";
import { createTask, deleteTask } from "~/server/Repositories/TrelloRepository";
import { setTask } from "~/server/Services/TrelloService";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const trelloRouter = createTRPCRouter({

  addTask: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        dueDate: z.string().datetime(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;
      await setTask({
        createdById: userId,
        title: opts.input.title,
        description: opts.input.description,
        dueDate: opts.input.dueDate,
      });
    }),

  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;
      await deleteTask({
        id: id,
      });
    }),
  
  updateTask: protectedProcedure



});