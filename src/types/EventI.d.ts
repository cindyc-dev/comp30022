import { ConnectionI } from "./ConnectionI";

export interface EventI {
  id: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  notes: string;
  relatedConnections: ConnectionI[];
  colour: string;
}

type CalendarViewType = "day" | "week" | "month";