import {prisma} from "~/server/db";
import {Prisma} from "@prisma/client";
import {TRPCError} from "@trpc/server";

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

export async function editEvent(userId: string, eventId: string, input: EventInput) {

  try {
    await prisma.calendarEvent.update({
      where: {
        id: eventId,
        ownerId: userId,
      },
      data: {
        title: input.title,
        start: input.startDateTime,
        end: input.endDateTime,
        location: input.location ?? undefined,
        notes: input.notes ?? undefined,
        colour: input.colour,
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }
    }
    throw e;
  }
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
      if (e.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }
    }
    throw e;
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


