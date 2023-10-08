import {prisma} from "~/server/db";
import {Prisma} from "@prisma/client";

const eventSelect = {
  id: true,
  title: true,
  start: true,
  end: true,
  location: true,
  notes: true,
  colour: true,
} satisfies Prisma.CalendarEventSelect;

export type EventPayload = Prisma.CalendarEventGetPayload<{ select: typeof eventSelect }>;


export async function getAllDbEvents(userId: string, start?: Date, end?: Date): Promise<EventPayload[]> {
  if (start && end) {
    return getDbEventsInRange(userId, start, end);
  }

  return prisma.calendarEvent.findMany({
    where: {
      ownerId: userId
    },
    select: eventSelect,
  });
}

function getDbEventsInRange(userId: string, start: Date, end: Date): Promise<EventPayload[]> {
  return prisma.calendarEvent.findMany({
    where: {
      ownerId: userId,
      start: {
        gte: start,
      },
      end: {
        lte: end,
      },
    },
    select: eventSelect,
  });
}


