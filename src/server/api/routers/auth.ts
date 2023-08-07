import { z } from "zod";
import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import { createAccount, accountExists } from "~/server/Services/AuthService";
import {TRPCError} from "@trpc/server";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async (opts) => {
      if (await accountExists(opts.input.email)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already exists",
        });
      }
      await createAccount(opts.input.email, opts.input.password);
    }),
});
