import moment from "moment";
import React from "react";
import { BG_COLOUR_MAP } from "~/types/Colours";
import { EventI } from "~/types/EventI";

interface EventProps {
  event: EventI;
  handleEventClick: (event: EventI) => void;
  events: EventI[];
  overNightAndMultiDayEvents: EventI[];
  row: number;
  col: number;
  width: string;
  left: string;
  duration: number;
}

function Event({
  event,
  handleEventClick,
  events,
  overNightAndMultiDayEvents,
  row,
  col,
  width,
  left,
  duration,
}: EventProps) {
  return (
    <div
      className={`mx-1 rounded px-1 ${
        BG_COLOUR_MAP[event.colour]
      } cursor-pointer overflow-hidden border-[1px] border-solid border-base-200`}
      style={{
        gridColumn: col,
        gridRow: `${row}/span ${duration}`,
        width: width,
        position: "relative",
        left: left,
      }}
      onClick={() => {
        if (
          overNightAndMultiDayEvents.filter((e) => e.id === event.id).length > 0
        ) {
          const originalEvent = events.filter((e) => e.id === event.id)[0];
          handleEventClick(originalEvent);
        } else {
          handleEventClick(event);
        }
      }}
    >
      <div className="truncate text-sm font-bold">{event.title}</div>
      <div className="truncate text-xs">
        {moment(event.startDateTime).format("HH:mm")} -{" "}
        {moment(event.endDateTime).format("HH:mm")}
      </div>
      {event.location && (
        <div className="truncate text-xs">📍 {event.location}</div>
      )}
    </div>
  );
}

export default Event;
