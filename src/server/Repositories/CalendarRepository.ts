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

interface EventInput {
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  notes?: string;
  colour: string;
}

export async function addEvent(userId: string, input: EventInput): Promise<string> {
  const res = await prisma.calendarEvent.create({
    data: {
      title: input.title,
      start: input.startDateTime,
      end: input.endDateTime,
      location: input.location ?? undefined,
      notes: input.notes ?? undefined,
      colour: input.colour,
      ownerId: userId,
    },
    select: {
      id: true,
    }
  });

  return res.id;
}

export async function deleteEvent(id: string, userId: string) {

  try {
    await prisma.calendarEvent.delete({
      where: {
        id: id,
        ownerId: userId,
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {

    }
  }
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

