import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { checkCustomExists, createCustomContact } from "~/server/Repositories/CustomContactRepository";

export const customContactRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object(
      { 
        userId: z.string(),
        name: z.string(),
        email: z.string().email(), 
        contact: z.string().optional(),
        tags: z.string(),
        notes: z.string().optional(),
      }
    ))
    .mutation(async (opts) => {
      if (await checkCustomExists(opts.input.userId, opts.input.email)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already exists",
        });
      }
      opts.input.contact == null ? opts.input.contact = "" :
        opts.input.notes == null ? opts.input.notes = "" :
          await createCustomContact(opts.input.userId, opts.input.name, opts.input.email, opts.input.contact, opts.input.tags, opts.input.notes);
    }),
});
