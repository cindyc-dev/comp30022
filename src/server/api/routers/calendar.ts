import { z } from "zod";
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {getAllEvents, getEventsInRange} from "~/server/Services/CalendarService";
import {addEvent} from "~/server/Repositories/CalendarRepository";

export const calendarRouter = createTRPCRouter({
  getEvents: protectedProcedure
    .input(z.object({
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    }))
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
    }),

  addEvent: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        startDateTime: z.string().datetime(),
        endDateTime: z.string().datetime(),
        location: z.string().optional(),
        notes: z.string().optional(),
        colour: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { title, startDateTime, endDateTime, location, notes, colour } = opts.input;

      const session = opts.ctx.session;
      const userId = session.user.id;
      const parsedStart = new Date(startDateTime);
      const parsedEnd = new Date(endDateTime);

      return await addEvent(userId, {
        title, location, notes, colour,
        startDateTime: parsedStart,
        endDateTime: parsedEnd,
      });
    }),
});
