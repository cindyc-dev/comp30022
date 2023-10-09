import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {checkCustomExists, checkExistingUserExists, createCustomContact, deleteCustomConnection, deleteManyCustomConnection, editCustomContact} from "~/server/Repositories/CustomContactRepository";
import { TRPCError } from "@trpc/server";
import { createConnection, deleteConnection, deleteManyExistingConnections, editExistingContact, searchAllUsers } from "~/server/Repositories/ConnectionRepository";
import { getAllUserConnectionsDetails } from "~/server/Services/UserConnections";
import { ConnectionI } from "~/types/ConnectionI";

export const connectionRouter = createTRPCRouter({
  createCustom: protectedProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      contactNumber: z.string(),
      tags: z.string().array(),
      notes: z.string(),
    }))
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      if (await checkCustomExists(userId, opts.input.email)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Custom contact already exists",
        });
      }

      const tags = "";
      if (opts.input.tags.length > 1) {
        opts.input.tags.forEach(item => {
          tags.concat(item); 
          tags.concat(",");
        });
      }

      await createCustomContact(userId, opts.input.name, opts.input.email, opts.input.contactNumber, tags, opts.input.notes);
    }),

  checkExistingUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async (opts) => {
      return await checkExistingUserExists(opts.input.email);
    }),

  deleteCustom: protectedProcedure
    .input(z.object({
      email: z.string(),
    }))
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      return await deleteCustomConnection(userId, opts.input.email);
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

      return await deleteConnection(userId, opts.input.connectionId);
    }),
  
  getAllConnections: protectedProcedure.query(async (opts) => {
    const session = opts.ctx.session;
    const userId = session.user.id;
    return await getAllUserConnectionsDetails(userId);
  }),

  searchAllUsers: protectedProcedure.input(
    z.object({
      emailString: z.string(),
      topX: z.number(),
    }))
    .mutation(async (opts) => {
      return await searchAllUsers(opts.input.emailString, opts.input.topX);
    }),

  editCustom: protectedProcedure.input(
    z.object({
      email: z.string(),
      connection: z.object({
        id: z.string(),
        name: z.string(),
        phone: z.string(),
        photoUrl: z.string(),
        email: z.string(),
        tags: z.string().array(),
        notes: z.string(),
        isExisting: z.boolean().optional(),
      }),
    }))
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      return await editCustomContact(userId, opts.input.email, opts.input.connection);
    }),

  editExisting: protectedProcedure.input(
    z.object({
      connectionId: z.string(),
      connection: z.object({
        name: z.string(),
        phone: z.string(),
        photoUrl: z.string(),
        email: z.string(),
        tags: z.string().array(),
        notes: z.string(),
        isExisting: z.boolean().optional(),
      })
    }))
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      return await editExistingContact(userId, opts.input.connectionId, opts.input.connection as ConnectionI);
    }),

  
  deleteMany: protectedProcedure.input(
    z.object({
      customEmails: z.string().array(),
      existingIDs: z.string().array(),
    })
  )
    .mutation(async (opts) => {
      const userId = opts.ctx.session.user.id;
      const customs = await deleteManyCustomConnection(userId, opts.input.customEmails);
      const existings = await deleteManyExistingConnections(userId, opts.input.existingIDs);

      return customs.count + existings.count;
    })
});
