import moment from "moment";
import { Moment } from "moment";
import { EventI } from "~/types/EventI";
import {
  handleScroll,
  arrayRange,
  getEventsInDay,
  getOverlappingGroups,
} from "./utils";
import { useEffect, useRef, useState } from "react";
import Event from "./event";

const TIME_WIDTH = "3em";
const TIME_GAP = "10px";
const ROW_HEIGHT = "1.2rem";
const GRID_TEMPLATE_COLUMNS = `${TIME_WIDTH} ${TIME_GAP} repeat(1, minmax(3rem, 1fr))`;

interface DayViewProps {
  today: Moment;
  dayEvents: EventI[];
  handleEventClick: (event: EventI) => void;
  overNightAndMultiDayEvents: EventI[];
  scrollToTime?: boolean;
  isDashboard?: boolean;
}

function DayView({
  today,
  dayEvents,
  handleEventClick,
  overNightAndMultiDayEvents,
  scrollToTime = true,
  isDashboard = false,
}: DayViewProps) {
  const [currentTimeRow, setCurrentTimeRow] = useState<number>(-1);

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
    if (scrollToTime) {
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
    }
  }, [today]);

  const overlappingGroups = getOverlappingGroups([
    ...overNightAndMultiDayEvents,
    ...getEventsInDay(today.clone(), dayEvents, false),
  ]);

  return (
    <div className="w-full">
      {/* White Part above Header */}
      {!isDashboard && (
        <div className="sticky top-16 z-30 h-2 bg-base-100"></div>
      )}
      {/* Sticky Header Day and Date */}
      <div
        className={`md:hide-scrollbar show-scrollbar sticky ${
          isDashboard ? "top-0" : "top-[4.5rem]"
        } z-40 grid overflow-x-scroll rounded bg-secondary py-2`}
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
          className="border-content border-l-2 text-center"
          style={{ gridRow: 1 }}
        >
          <p className="m-0">{today.clone().format("ddd").toUpperCase()}</p>
          <button
            className={`btn btn-circle btn-sm md:btn-md ${
              moment().format("YYYY-MM-DD") ===
              today.clone().format("YYYY-MM-DD")
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
        className="md:hide-scrollbar show-scrollbar grid w-full overflow-x-scroll"
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
            className="border-content row-span-2 border-b-2"
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
                    : "border-content"
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
          // Calculate width and left position of the event based on overlapping groups
          // Find the overlapping group that the event belongs to
          const overlappingGroup = overlappingGroups.filter((group) =>
            group.includes(event)
          )[0];
          let width = "100%";
          let left = "0";
          if (overlappingGroup !== undefined) {
            const indexInGroup = overlappingGroup.indexOf(event);
            const numOverlappingEvents = overlappingGroup.length;
            width = `calc((100%) / ${numOverlappingEvents})`;
            left = `calc(${indexInGroup} * ${width})`;
          }
          return (
            <Event
              key={i}
              event={event}
              events={dayEvents}
              overNightAndMultiDayEvents={overNightAndMultiDayEvents}
              handleEventClick={handleEventClick}
              row={row}
              col={col}
              width={width}
              left={left}
              duration={duration}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DayView;
