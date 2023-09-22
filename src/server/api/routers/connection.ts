import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {checkCustomExists, checkExistingUserExists, createCustomContact, deleteCustomConnection} from "~/server/Repositories/CustomContactRepository";
import { TRPCError } from "@trpc/server";
import { createConnection, deleteAllExisting, deleteConnection } from "~/server/Repositories/ConnectionRepository";
import { getAllUserConnectionsDetails } from "~/server/Services/UserConnections";

export const connectionRouter = createTRPCRouter({
  createCustom: protectedProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      contactNumber: z.string(),
      tags: z.string().array(),
    }))
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      if (opts.input.tags.length > 1) {
        console.log("Tags not supported yet.");
      }
      if (await checkCustomExists(userId, opts.input.email)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Custom contact already exists",
        });
      }

      await createCustomContact(userId, opts.input.name, opts.input.email, opts.input.contactNumber);
    }),

    checkExistingUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      contactNumber: z.string(),
    }))
    .mutation(async (opts) => {
        return await checkExistingUserExists(opts.input.email, opts.input.contactNumber);
    }),

  deleteCustom: protectedProcedure
    .input(z.object({
      email: z.string(),
      contact: z.string().optional(),
    }))
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      await deleteCustomConnection(userId, opts.input.email, opts.input.contact);
    }),

  createExisting: protectedProcedure
    .input(z.object({
      connectionId: z.string(),
    }))
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      await createConnection(userId, opts.input.connectionId);
    }),
  
  deleteExisting: protectedProcedure
  .input(z.object({
    connectionId: z.string(),
  }))
  .mutation(async (opts) => {
    const userId = opts.ctx.session.user.id;

    await deleteConnection(userId, opts.input.connectionId);
  }),

  deleteAllExisting: protectedProcedure.mutation(async (opts) => {
    return await deleteAllExisting();
}),
  
  getAllConnections: protectedProcedure.query(async (opts) => {
    const session = opts.ctx.session;
    const userId = session.user.id;
    return await getAllUserConnectionsDetails(userId);
  })
});
