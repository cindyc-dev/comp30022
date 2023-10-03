import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {createCustomContact} from "~/server/Repositories/CustomContactRepository";

export const connectionRouter = createTRPCRouter({
  custom: protectedProcedure
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

      await createCustomContact(userId, opts.input.name, opts.input.email, opts.input.contactNumber);
    }),
});
