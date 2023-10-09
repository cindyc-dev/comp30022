import { Moment } from "moment";
import { arrayRange, handleScroll } from "./utils";
import { useRef } from "react";
import { EventI } from "~/types/EventI";
import moment from "moment";
import { BG_COLOUR_MAP } from "~/types/Colours";

interface MonthViewProps {
  today: Moment;
  goToDay: (date: Moment) => void;
  monthEvents: EventI[];
  handleEventClick: (event: EventI) => void;
}

const GRID_TEMPLATE_COLUMNS = "repeat(7, minmax(3rem, 1fr))";
const EVENT_HEIGHT = "1.2rem";
const NUM_ROWS = 5;
const EVENTS_PER_ROW = 3;
const BODY_ROWS = EVENTS_PER_ROW * 2 + 1;
const SINGLE_ROW = `2.2rem ${(EVENT_HEIGHT + " ").repeat(BODY_ROWS)}`;
const GRID_TEMPLATE_ROWS = `${(SINGLE_ROW + " ").repeat(NUM_ROWS)}`;

export default function MonthView({
  today,
  goToDay,
  monthEvents,
  handleEventClick,
}: MonthViewProps) {
  // Make the Header and Body scroll together
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const monthStart = today.clone().startOf("month");

  // Organise the events by day like day: [events] and sort them by start time
  const eventsByDay: { [key: string]: EventI[] } = {};
  monthEvents.forEach((event) => {
    const day = moment(event.startDateTime).format("YYYY-MM-DD");
    if (!eventsByDay[day]) {
      eventsByDay[day] = [];
    }
    eventsByDay[day].push(event);
  });
  Object.keys(eventsByDay).forEach((day) => {
    eventsByDay[day].sort((a, b) =>
      moment(a.startDateTime).isBefore(moment(b.startDateTime)) ? -1 : 1
    );
  });

  console.log(eventsByDay); // TODO remove

  return (
    <div className="h-full w-full">
      {/* Sticky Header Days */}
      <div
        className="hide-scrollbar sticky top-[4.5rem] z-40 grid overflow-x-scroll rounded bg-secondary py-2"
        style={{
          gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
          boxShadow: "0px 15px 10px -15px #ececec",
        }}
        ref={headerRef}
        onScroll={(e) => handleScroll({ e, otherRef: bodyRef })}
      >
        {/* Days Sunday to Saturday */}
        {arrayRange(0, 6).map((day, i) => {
          const currDate = today.startOf("week").clone().add(day, "day");
          return (
            <div
              key={day}
              className={`${i > 0 && "border-l-2"} border-base-100 text-center`}
            >
              <p className="m-0">{currDate.format("ddd").toUpperCase()}</p>
            </div>
          );
        })}
      </div>
      <div
        className="hide-scrollbar mt-1 grid w-full overflow-x-scroll"
        style={{
          gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
          gridTemplateRows: GRID_TEMPLATE_ROWS,
          // backgroundColor: "#EAECF6",
        }}
        ref={bodyRef}
        onScroll={(e) => handleScroll({ e, otherRef: headerRef })}
      >
        {arrayRange(0, 4).map((week) =>
          arrayRange(0, 6).map((day, i) => {
            const currDate = monthStart
              .clone()
              .startOf("week")
              .add(week, "week")
              .add(day, "day");
            const rowStart = `${week * (BODY_ROWS + 1) + 1}`;
            const rowEnd = `${week * (BODY_ROWS + 1) + (BODY_ROWS + 1) + 1}`;
            return (
              <div
                key={day}
                className={`flex flex-col items-center border-b-2 ${
                  i > 0 && "border-l-2"
                } py-1 ${
                  !currDate.isSame(today, "month")
                    ? "hash-background border-base-100"
                    : "border-base-200"
                }`}
                style={{
                  gridRowStart: rowStart,
                  gridRowEnd: rowEnd,
                  gridColumnStart: `${day + 1}`,
                  gridColumnEnd: `${day + 2}`,
                }}
              >
                <button
                  className={`btn btn-circle btn-sm m-0 whitespace-nowrap ${
                    moment().format("YYYY-MM-DD") ===
                    currDate.format("YYYY-MM-DD")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                  onClick={() => {
                    goToDay(currDate);
                  }}
                >
                  {currDate.isSame(currDate.clone().startOf("month"))
                    ? currDate.format("MMM DD")
                    : currDate.format("DD")}
                </button>
              </div>
            );
          })
        )}
        {monthEvents.map((event) => (
          <Event
            key={event.id}
            event={event}
            eventsByDay={eventsByDay}
            goToDay={goToDay}
            handleEventClick={handleEventClick}
          />
        ))}
      </div>
    </div>
  );
}

function Event({
  event,
  eventsByDay,
  goToDay,
  handleEventClick,
}: {
  event: EventI;
  eventsByDay: { [key: string]: EventI[] };
  goToDay: (date: Moment) => void;
  handleEventClick: (event: EventI) => void;
}) {
  // Row based on week number of month
  const start = moment(event.startDateTime);

  const startCol = `${start.clone().day() + 1}`;
  const endCol = `${moment(event.endDateTime).clone().day() + 2}`;
  const week =
    start.clone().startOf("week").diff(start.clone().startOf("month"), "week") *
      (BODY_ROWS + 1) +
    (BODY_ROWS + 1) +
    1;
  const day = start.clone().format("YYYY-MM-DD");
  const eventNum = eventsByDay[day].indexOf(event);

  const startRow = week + eventNum * 2 + 1;
  const endRow = startRow + 2;
  if (eventNum >= EVENTS_PER_ROW) {
    // Add a "x more" event
    if (eventNum === EVENTS_PER_ROW) {
      return (
        <div
          className={
            "m-0 mx-1 mb-1 mt-0.5 cursor-pointer overflow-hidden rounded bg-base-300 px-1"
          }
          style={{
            gridColumn: startCol,
            gridRow: startRow,
          }}
          onClick={() => goToDay(start)}
        >
          <div className="-mt-0.5 truncate text-xs">
            {eventsByDay[day].length - EVENTS_PER_ROW} more
          </div>
        </div>
      );
    }

    return null;
  }
  return (
    <div
      className={`${
        BG_COLOUR_MAP[event.colour]
      } m-0 mx-1 mt-0.5 cursor-pointer overflow-hidden rounded px-1`}
      style={{
        gridColumnStart: startCol,
        gridColumnEnd: endCol,
        gridRowStart: startRow,
        gridRowEnd: endRow,
      }}
      onClick={() => handleEventClick(event)}
    >
      <div className="-mt-0.5 truncate text-xs font-semibold md:text-sm">
        {event.title}
      </div>
      <div className="overflow-clip whitespace-nowrap text-xs">
        {moment(event.startDateTime).format("HH:mm")} -{" "}
        {moment(event.endDateTime).format("HH:mm")}
      </div>
    </div>
  );
}
