import {EventI} from "~/types/EventI";
import {EventPayload, getAllDbEvents} from "~/server/Repositories/CalendarRepository";

export async function getAllEvents(userId: string): Promise<EventI[]> {
  const dbEvents = await getAllDbEvents(userId);

  return dbEvents.map(parseDbEvent);
}

export async function getEventsInRange(userId: string, start: Date, end: Date): Promise<EventI[]> {
  const dbEvents = await getAllDbEvents(userId, start, end);

  return dbEvents.map(parseDbEvent);
}

function parseDbEvent(dbEvents: EventPayload): EventI {
  return {
    id: dbEvents.id,
    title: dbEvents.title,
    startDateTime: dbEvents.start,
    endDateTime: dbEvents.end,
    location: dbEvents.location ?? undefined,
    notes: dbEvents.notes ?? undefined,
    colour: dbEvents.colour,
    isExternal: false,
  };
}
