import { EventI } from "~/types/EventI";
import {
  EventPayload,
  getAllConnectedEvents,
  getAllDbEvents,
} from "~/server/Repositories/CalendarRepository";
import {ConnectionI} from "~/types/ConnectionI";

export async function getAllEvents(userId: string): Promise<EventI[]> {
  const dbEvents = await getAllDbEvents(userId);
  const connectedEvents = await getAllConnectedEvents(userId);

  return dbEvents
    .map(parseSelfDbEvent)
    .concat(connectedEvents.map(parseConnectedDbEvent));
}

export async function getEventsInRange(
  userId: string,
  start: Date,
  end: Date
): Promise<EventI[]> {
  const dbEvents = await getAllDbEvents(userId, start, end);
  const connectedEvents = await getAllConnectedEvents(userId);

  return dbEvents
    .map(parseSelfDbEvent)
    .concat(connectedEvents.map(parseConnectedDbEvent));
}

function parseSelfDbEvent(dbEvent: EventPayload): EventI {
  let invitees: ConnectionI[] = dbEvent.invitees.map((invitee) => ({
    id: invitee.id,
    name: invitee.name ?? "",
    email: invitee.email ?? "",
    photoUrl: invitee.image ?? undefined,
    tags: [],
    isExisting: true,
  }));

  invitees = invitees.concat(dbEvent.customInvitees.map(invitee => ({
    id: invitee.id,
    name: invitee.name ?? "",
    email: invitee.email ?? "",
    photoUrl: invitee.image ?? undefined,
    tags: [],
    isExisting: false,
  })));

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    startDateTime: dbEvent.start,
    endDateTime: dbEvent.end,
    location: dbEvent.location ?? undefined,
    notes: dbEvent.notes ?? undefined,
    colour: dbEvent.colour,
    relatedConnections: invitees,
    isExternal: false,
  };
}

function parseConnectedDbEvent(dbEvent: EventPayload): EventI {
  const res = parseSelfDbEvent(dbEvent);

  res.isExternal = true;

  return res;
}
