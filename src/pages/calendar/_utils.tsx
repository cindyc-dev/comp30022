import moment from "moment";
import { Moment } from "moment";
import { EventI } from "~/types/EventI";

export const arrayRange = (start: number, stop: number, step: number = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
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

export const getEventsInMonth = (today: Moment, events: EventI[]) => {
  const start = today.clone().startOf("month");
  const end = today.clone().endOf("month");
  const monthEvents = events.filter((event) => {
    const eventStart = moment(event.startDateTime);
    const eventEnd = moment(event.endDateTime);
    return (
      eventStart.isBetween(start, end, "day", "[]") ||
      eventEnd.isBetween(start, end, "day", "[]")
    );
  });
  return monthEvents;
};

// Used for scrolling the header and body together
export const handleScroll = ({
  e,
  otherRef,
}: {
  e: React.UIEvent<HTMLDivElement>;
  otherRef: React.RefObject<HTMLDivElement>;
}) => {
  const target = e.target as HTMLDivElement;
  if (otherRef.current) {
    otherRef.current.scrollLeft = target.scrollLeft;
  }
};

// Overnight/Multi-day events to be shown as extra events in UI
// Check if event goes over multiple days, if so, create events for each day
export const getOvernightAndMultiDayEvents = (events: EventI[]) => {
  const overnightAndMultiDayEvents: EventI[] = [];
  events.forEach((event) => {
    const start = moment(event.startDateTime);
    const end = moment(event.endDateTime);
    const daysDiff = end
      .clone()
      .startOf("day")
      .diff(start.clone().startOf("day"), "days");
    if (daysDiff > 0) {
      for (let i = 1; i <= daysDiff; i++) {
        overnightAndMultiDayEvents.push({
          ...event,
          startDateTime: moment(start).add(i, "days").startOf("day").toDate(),
          endDateTime: end.toDate(),
        });
      }
    }
  });
  return overnightAndMultiDayEvents;
};
