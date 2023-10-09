import moment from "moment";
import { Moment } from "moment";
import { BG_COLOUR_MAP } from "~/types/Colours";
import { EventI } from "~/types/EventI";
import { handleScroll, arrayRange, getEventsInDay } from "./utils";
import { useEffect, useRef, useState } from "react";

const TIME_WIDTH = "3em";
const TIME_GAP = "10px";
const ROW_HEIGHT = "1.2rem";
const GRID_TEMPLATE_COLUMNS = `${TIME_WIDTH} ${TIME_GAP} repeat(1, minmax(3rem, 1fr))`;

interface DayViewProps {
  today: Moment;
  dayEvents: EventI[];
  handleEventClick: (event: EventI) => void;
  overNightAndMultiDayEvents: EventI[];
}

function DayView({
  today,
  dayEvents,
  handleEventClick,
  overNightAndMultiDayEvents,
}: DayViewProps) {
  const [currentTimeRow, setCurrentTimeRow] = useState<number>(-1);

  console.log({
    view: "Day",
    dayEvents: dayEvents,
    overNightAndMultiDayEvents: overNightAndMultiDayEvents,
  });

  // Make the Header and Body scroll together
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Calculate where is the current time to scroll to
  const currentDay = 3;
  const getCurrentTimeRow = () => {
    const currentTime = moment();
    const isCurrentTimeToday = currentTime.isSame(today.clone(), "day");
    if (!isCurrentTimeToday) {
      return -1;
    }
    const currentTimeNearestHalfHour =
      currentTime.minute() < 16 ? 0 : currentTime.minute() > 45 ? 2 : 1;
    const row = currentTime.hour() * 2 + currentTimeNearestHalfHour;
    return row;
  };

  // Scroll to current time
  useEffect(() => {
    // Set current time row on first render
    setCurrentTimeRow(getCurrentTimeRow());
    // Scroll to current time
    const currentHour = getCurrentTimeRow();
    const currentRow = document.getElementById(`${currentHour}${currentDay}`);
    if (currentRow) {
      currentRow.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [today]);

  return (
    <div className="w-full">
      {/* White Part above Header */}
      <div className="sticky top-16 z-30 h-2 bg-base-100"></div>
      {/* Sticky Header Days and Dates from Sunday to Saturday */}
      <div
        className="hide-scrollbar sticky top-[4.5rem] z-40 grid overflow-x-scroll rounded bg-secondary py-2"
        style={{
          gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
          boxShadow: "0px 15px 10px -15px #ececec",
          gridRowStart: 1,
          gridRowEnd: 3,
          gridColumnStart: 1,
          gridColumnEnd: 10,
        }}
        ref={headerRef}
        onScroll={(e) =>
          handleScroll({
            e: e,
            otherRef: bodyRef,
          })
        }
      >
        {/* Fillers */}
        <div
          className={`w-[${TIME_WIDTH}]`}
          style={{ gridRow: 1, minWidth: TIME_WIDTH }}
        ></div>
        <div className={`w-[${TIME_GAP}]`} style={{ gridRow: 1 }}></div>
        {/* Day (Mon/Tue/..) and Date Number */}
        <div
          className="border-l-2 border-base-100 text-center"
          style={{ gridRow: 1 }}
        >
          <p className="m-0">{today.clone().format("ddd").toUpperCase()}</p>
          <button
            className={`btn btn-circle btn-sm md:btn-md ${
              moment().format("YYYY-MM-DD") === today.clone().format("YYYY-MM-DD")
                ? "btn-primary"
                : "btn-ghost"
            }`}
            onClick={() => {}}
          >
            {today.clone().format("D")}
          </button>
        </div>
      </div>
      {/* Body */}
      <div
        className="hide-scrollbar grid w-full overflow-x-scroll"
        style={{
          gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
          gridTemplateRows: `repeat(48, ${ROW_HEIGHT})`,
        }}
        ref={bodyRef}
        onScroll={(e) =>
          handleScroll({
            e: e,
            otherRef: headerRef,
          })
        }
      >
        {/* Times from 00:00 to 23:00 */}
        {arrayRange(0, 23).map((hour) => (
          <div
            key={hour}
            className="row-span-2 text-right"
            style={{ gridColumn: 1, gridRow: hour * 2 + 1 }}
          >
            <p className="m-0 -mt-2">{hour}:00</p>
          </div>
        ))}
        {/* Markers for Hours */}
        {arrayRange(0, 24).map((hour) => (
          <div
            key={hour}
            className="row-span-2 border-b-2 border-base-200"
            style={{
              gridColumnStart: 2,
              gridColumnEnd: 3,
              gridRowStart: hour * 2,
              gridRowEnd: hour * 2 + 1,
            }}
          ></div>
        ))}
        {/* Fill rows with borders */}
        {arrayRange(3, 4, 1).map((col) =>
          arrayRange(0, 48, 1).map((row) => {
            const isCurrentTime = row === currentTimeRow && col === currentDay;
            return (
              <div
                key={row}
                id={`${row}${col}`}
                // Different border styles for current time
                className={`border-l-2 ${
                  isCurrentTime
                    ? "z-10 border-b-[3px] border-b-primary"
                    : "border-base-200"
                } ${
                  row % 2 && !isCurrentTime ? "border-b-[1px]" : "border-b-2"
                }`}
                style={{
                  gridColumn: col,
                  gridRowStart: row,
                  gridRowEnd: row + 1,
                }}
              >
                {/* Current Time Circle Indicator */}
                {isCurrentTime && (
                  <div
                    className={`relative left-[-0.3rem] ${
                      currentTimeRow === 0 ? "top-[0.3rem]" : "top-[0.9rem]"
                    } h-2 w-2 rounded-full bg-primary`}
                  ></div>
                )}
              </div>
            );
          })
        )}

        {/* Events */}
        {[
          ...overNightAndMultiDayEvents,
          ...getEventsInDay(today.clone(), dayEvents, false),
        ].map((event, i) => {
          // Calculate the column and row for the event
          const col = 3;
          let row = event.startDateTime.getHours() * 2 + 1;
          if (event.startDateTime.getMinutes() === 30) {
            row += 1;
          }
          // Calculate the duration of the event (to the nearest half hour)
          const duration =
            Math.round(
              moment(event.endDateTime)
                .clone()
                .diff(moment(event.startDateTime).clone(), "minutes") / 60
            ) * 2;

          return (
            <div
              key={i}
              className={`mx-1 rounded px-1 ${
                BG_COLOUR_MAP[event.colour]
              } cursor-pointer`}
              style={{
                gridColumn: col,
                gridRow: `${row}/span ${duration}`,
              }}
              onClick={() => {
                if (
                  overNightAndMultiDayEvents.filter((e) => e.id === event.id)
                    .length > 0
                ) {
                  const originalEvent = dayEvents.filter(
                    (e) => e.id === event.id
                  )[0];
                  handleEventClick(originalEvent);
                } else {
                  handleEventClick(event);
                }
              }}
            >
              <div className="truncate text-sm">{event.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DayView;
