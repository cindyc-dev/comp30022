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
  connections: string[];
  customConnections: string[];
}

export async function addEvent(userId: string, input: EventInput): Promise<string> {
  const customConnections: string[] = [];

  for (const email of input.customConnections) {
    const id = await getCustomConnectionId(userId, email);
    customConnections.push(id);
  }

  const res = await prisma.calendarEvent.create({
    data: {
      title: input.title,
      start: input.startDateTime,
      end: input.endDateTime,
      location: input.location ?? undefined,
      notes: input.notes ?? undefined,
      colour: input.colour,
      ownerId: userId,
      invitees: {
        connect: input.connections.map((id) => {
          return {
            id: id,
          };
        }),
      },
      customInvitees: {
        connect: customConnections.map((id) => {
          return {
            id
          };
        }),
      },
    },
    select: {
      id: true,
    }
  });

  return res.id;
}

export async function editEvent(userId: string, eventId: string, input: EventInput) {

  try {
    const customConnections: string[] = [];

    for (const email of input.customConnections) {
      const id = await getCustomConnectionId(userId, email);
      customConnections.push(id);
    }

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
        invitees: {
          connect: input.connections.map((id) => {
            return {
              id: id,
            };
          }),
        },
        customInvitees: {
          connect: customConnections.map((id) => {
            return {
              id
            };
          }),
        },
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

async function getCustomConnectionId(id: string, email: string): Promise<string> {
  const res = await prisma.customContact.findUnique({
    where: {
      email: email,
      id: id,
    },
    select: {
      id: true,
    }
  });

  if (!res) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Custom connection with email " + email + " not found.",
    });
  }

  return res.id;
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

