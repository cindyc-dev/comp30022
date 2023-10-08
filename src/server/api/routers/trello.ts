import { z } from "zod";
import { removeTask, updateTask } from "~/server/Services/TrelloService";
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
      await removeTask(userId);
    }),
  
  updateTask: protectedProcedure
    .input(
      z.object({
        // id
        title: z.string(),
        description: z.string(),
        dueDate: z.string().datetime(),
      })
    )
    .mutation(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;
      await updateTask(userId, opts.input.title, opts.input.description, opts.input.dueDate);
    }),

  // getTask: protectedProcedure
  //   .query()


});