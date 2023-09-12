import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { checkCustomExists, createCustomContact } from "~/server/Repositories/CustomContactRepository";

export const customContactRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object(
      { email: z.string().email(), contact: z.string() }
    ))
    .mutation(async (opts) => {
      if (await checkCustomExists(opts.input.email, opts.input.contact)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already exists",
        });
      }
      await createCustomContact(opts.input.email, opts.input.contact);
    }),
});
