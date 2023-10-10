import moment from "moment";
import { Moment } from "moment";
import { EventI } from "~/types/EventI";

const sortByDate = (a: EventI, b: EventI) =>
  moment(a.startDateTime).diff(moment(b.startDateTime));

export const arrayRange = (start: number, stop: number, step: number = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );

export const getEventsInDay = (
  today: Moment,
  events: EventI[],
  getOverlaps = false
) => {
  const start = today.clone().startOf("day");
  const end = today.clone().endOf("day");
  const dayEvents = events.filter((event) => {
    const eventStart = moment(event.startDateTime);
    const eventEnd = moment(event.endDateTime);
    if (getOverlaps) {
      // Check if there is any overlap between the event and the day
      return (
        start.isAfter(eventStart, "day") ? start : eventStart
      ).isSameOrBefore(end.isBefore(eventEnd, "day") ? end : eventEnd, "day");
    } else {
      // Check if the event starts in the day
      return eventStart.isBetween(start, end, "day", "[]");
    }
  });
  return dayEvents.sort(sortByDate);
};

export const getEventsInWeek = (
  today: Moment,
  events: EventI[],
  getOverlaps = false
) => {
  const start = today.clone().startOf("week");
  const end = today.clone().endOf("week");

  const weekEvents = events.filter((event) => {
    const eventStart = moment(event.startDateTime);
    const eventEnd = moment(event.endDateTime);
    if (getOverlaps) {
      // Check if there is any overlap between the event and the week
      return (
        start.isAfter(eventStart, "day") ? start : eventStart
      ).isSameOrBefore(end.isBefore(eventEnd, "day") ? end : eventEnd, "day");
    } else {
      // Check if the event starts in the week
      return eventStart.isBetween(start, end, "day", "[]");
    }
  });
  return weekEvents.sort(sortByDate);
};

export const getEventsInMonth = (
  today: Moment,
  events: EventI[],
  getOverlaps = false
) => {
  const start = today.clone().startOf("month");
  const end = today.clone().endOf("month");

  const monthEvents = events.filter((event) => {
    const eventStart = moment(event.startDateTime);
    const eventEnd = moment(event.endDateTime);
    if (getOverlaps) {
      // Check if there is any overlap between the event and the month
      return (
        start.isAfter(eventStart, "day") ? start : eventStart
      ).isSameOrBefore(end.isBefore(eventEnd, "day") ? end : eventEnd, "day");
    } else {
      // Check if the event starts in the month
      return eventStart.isBetween(start, end, "day", "[]");
    }
  });
  return monthEvents.sort(sortByDate);
};

// Events that go over multiple weeks to be shown as extra events in UI
// Check if event goes over multiple weeks, if so, create events for each week
// Does not create first event (from the start date to the end of the week - that happens in monthView.tsx)
export const getOverWeekEvents = (events: EventI[], today: Moment) => {
  const overWeekEvents: EventI[] = [];
  events.forEach((event) => {
    const start = moment(event.startDateTime);
    const end = moment(event.endDateTime);
    const weeksDiff = end
      .clone()
      .startOf("week")
      .diff(start.clone().startOf("week"), "weeks");
    if (weeksDiff > 0) {
      // Create events for each week
      for (let i = 1; i <= weeksDiff; i++) {
        // Calculate the start and end date of the event for the week
        const startDateTime = start
          .clone()
          .add(i, "weeks")
          .startOf("week")
          .toDate();
        const endDateTime =
          i === weeksDiff
            ? end.toDate()
            : start.clone().add(i, "weeks").endOf("week").toDate();

        // Only add events that are in the month
        if (
          !moment(startDateTime).isBetween(
            today.clone().startOf("month").startOf("week"),
            today.clone().endOf("month").endOf("week"),
            "day",
            "[]"
          ) ||
          !moment(endDateTime).isBetween(
            today.clone().startOf("month").startOf("week"),
            today.clone().endOf("month").endOf("week"),
            "day",
            "[]"
          )
        ) {
          continue;
        }

        overWeekEvents.push({
          ...event,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
        });
      }
    }
  });

  return overWeekEvents.sort(sortByDate);
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
export const getOvernightAndMultiDayEvents = (
  events: EventI[],
  startRange: Moment,
  endRange: Moment
) => {
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
        const startDateTime = start
          .clone()
          .add(i, "days")
          .startOf("day")
          .toDate();
        const endDateTime =
          i === daysDiff
            ? end.toDate()
            : start.clone().add(i, "days").endOf("day").toDate();

        // Only add events that are in the range
        if (
          !moment(startDateTime).isBetween(startRange, endRange, "day", "[]") ||
          !moment(endDateTime).isBetween(startRange, endRange, "day", "[]") ||
          // Event that ends at 00:00 on the next day is not considered overnight
          moment(endDateTime).isSame(moment(endDateTime).startOf("day"))
        ) {
          continue;
        }

        overnightAndMultiDayEvents.push({
          ...event,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
        });
      }
    }
  });

  return overnightAndMultiDayEvents.sort(sortByDate);
};

// Check if any events overlap
export const getOverlappingGroups = (events: EventI[]) => {
  const overlappingGroups: EventI[][] = [];
  events.forEach((event) => {
    const start = moment(event.startDateTime);
    const end = moment(event.endDateTime);
    const overlapping = events.filter((e) => {
      const eStart = moment(e.startDateTime);
      const eEnd = moment(e.endDateTime);
      return (
        (start.isBetween(eStart, eEnd, "minute", "[]") ||
          end.isBetween(eStart, eEnd, "minute", "[]")) &&
        e.id !== event.id
      );
    });
    if (overlapping.length > 0) {
      const overlappingGroup = [event, ...overlapping].sort(sortByDate);
      // Add the event to the existing group
      overlappingGroups.forEach((group) => {
        if (group.every((e) => overlappingGroup.includes(e))) {
          overlappingGroup.forEach((e) => {
            if (!group.includes(e)) {
              group.push(e);
            }
          });
        }
      });

      // Check if the group already exists
      if (
        overlappingGroups.filter((group) => {
          return group.every((e) => overlappingGroup.includes(e));
        }).length === 0
      ) {
        overlappingGroups.push(overlappingGroup);
      }
    }
  });
  return overlappingGroups;
};
