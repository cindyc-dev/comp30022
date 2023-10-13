import { Colour } from "./Colours";
import { ConnectionI } from "./ConnectionI";

export interface EventI {
  id: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  notes?: string;
  relatedConnections: ConnectionI[];
  colour: Colour;
  isExternal: boolean;
}

export interface EventStateI {
  allEvents: EventI[];
  weekEvents: EventI[];
  monthEvents: EventI[];
  dayEvents: EventI[];
}

type CalendarViewType = "day" | "week" | "month";
