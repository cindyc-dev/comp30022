import moment from "moment";
import { Moment } from "moment";
import { EventI } from "~/types/EventI";

export const arrayRange = (start: number, stop: number, step: number = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export const getEventsInWeek = (today: Moment, events: EventI[]) => {
  const start = today.clone().startOf("week");
  const end = today.clone().endOf("week");
  const weekEvents = events.filter((event) => {
    const eventStart = moment(event.startDateTime);
    const eventEnd = moment(event.endDateTime);
    return (
      eventStart.isBetween(start, end, "day", "[]") ||
      eventEnd.isBetween(start, end, "day", "[]")
    );
  });
  return weekEvents;
};
