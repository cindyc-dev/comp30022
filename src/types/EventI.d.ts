import { Colour } from "./Colours";
import { ConnectionI } from "./ConnectionI";

export interface EventI {
  id: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  notes: string;
  relatedConnections: ConnectionI[];
  colour: Colour;
}

type CalendarViewType = "day" | "week" | "month";