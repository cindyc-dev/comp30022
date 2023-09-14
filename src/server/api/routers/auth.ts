import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { createAccount, accountExists, updatePassword } from "~/server/Services/AuthService";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object(
      { email: z.string().email(), password: z.string() }
    ))
    .mutation(async (opts) => {
      if (await accountExists(opts.input.email)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already exists",
        });
      }
      await createAccount(opts.input.email, opts.input.password);
    }),
  
  setPassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string(), newPassword: z.string()
    }))
    .mutation(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;

      // true on success; false if Prisma/fetching had an error
      return await updatePassword(userId, opts.input.currentPassword, opts.input.newPassword);
    })
});
