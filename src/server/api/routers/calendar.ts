import { z } from "zod";
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {getAllEvents, getEventsInRange} from "~/server/Services/CalendarService";

export const calendarRouter = createTRPCRouter({
  getEvents: protectedProcedure
    .input(
      z.object({
        start: z.string().datetime().optional(),
        end: z.string().datetime().optional(),
      })
    )
    .query(async (opts) => {
      const session = opts.ctx.session;
      const userId = session.user.id;
      const { start, end } = opts.input;

      if (start && end) {
        const startDateTime = new Date(start);
        const endDateTime = new Date(end);

        return await getEventsInRange(userId, startDateTime, endDateTime);
      }

      return await getAllEvents(userId);
    })
});
