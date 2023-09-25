import moment, { Moment } from "moment";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CalendarViewType, EventI } from "~/types/EventI";
import { arrayRange, handleScroll } from "./_utils";
import { BG_COLOUR_MAP } from "~/types/Colours";

const TIME_WIDTH = "3em";
const TIME_GAP = "10px";
const ROW_HEIGHT = "1.2rem";
const GRID_TEMPLATE_COLUMNS = `${TIME_WIDTH} 10px repeat(7, minmax(3rem, 1fr))`;

export default function WeekView({
  today,
  setToday,
  setView,
  weekEvents,
}: {
  today: Moment;
  setToday: Dispatch<SetStateAction<moment.Moment>>;
  setView: Dispatch<SetStateAction<CalendarViewType | undefined>>;
  weekEvents: EventI[];
}) {
  const [currentTimeRow, setCurrentTimeRow] = useState<number>(-1);

  // Update currentTimeRow every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeRow(getCurrentTimeRow());
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Make the Header and Body scroll together
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const currentDay = moment().day() + 3;
  const getCurrentTimeRow = () => {
    const currentTime = moment();
    const isCurrentTimeInWeek = currentTime.isBetween(
      today.clone().startOf("week"),
      today.clone().endOf("week")
    );
    if (!isCurrentTimeInWeek) {
      return -1;
    }
    const currentTimeNearestHalfHour =
      currentTime.minute() < 16 ? 0 : currentTime.minute() > 45 ? 2 : 1;
    const row = currentTime.hour() * 2 + currentTimeNearestHalfHour;
    return row;
  };

  // Scroll to current time
  useEffect(() => {
    setCurrentTimeRow(getCurrentTimeRow());
    const currentHour = getCurrentTimeRow();
    const currentRow = document.getElementById(`${currentHour}${currentDay}`);
    if (currentRow) {
      currentRow.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, []);

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
        {arrayRange(0, 6).map((day) => {
          const currDate = today.startOf("week").clone().add(day, "day");
          return (
            <div
              key={day}
              className="border-l-2 border-base-100 text-center"
              style={{ gridRow: 1 }}
            >
              <p className="m-0">
                {today
                  .startOf("week")
                  .clone()
                  .add(day, "day")
                  .format("ddd")
                  .toUpperCase()}
              </p>
              <button
                className={`btn btn-circle btn-sm md:btn-md ${
                  moment().format("YYYY-MM-DD") ===
                  currDate.format("YYYY-MM-DD")
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                onClick={() => {
                  setView("day");
                  setToday(currDate);
                }}
              >
                {currDate.format("D")}
              </button>
            </div>
          );
        })}
      </div>
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
        {arrayRange(3, 9, 1).map((col) =>
          arrayRange(0, 48, 1).map((row) => {
            const isCurrentTime = row === currentTimeRow && col === currentDay;
            return (
              <div
                key={row}
                id={`${row}${col}`}
                className={`border-l-2 ${
                  isCurrentTime
                    ? "border-b-[3px] border-b-primary"
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
                  <div className="relative left-[-0.3rem] top-[0.9rem] h-2 w-2 rounded-full bg-primary"></div>
                )}
              </div>
            );
          })
        )}

        {/* Events */}
        {weekEvents.map((event, i) => {
          const col = event.startDateTime.getDay() + 3;
          let row = event.startDateTime.getHours() * 2 + 1;
          if (event.startDateTime.getMinutes() === 30) {
            row += 1;
          }
          const duration =
            (moment(event.endDateTime).diff(event.startDateTime, "minutes") /
              60) *
            2;

          return (
            <div
              key={i}
              className={`mx-1 rounded px-1 ${BG_COLOUR_MAP[event.colour]}`}
              style={{
                gridColumn: col,
                gridRow: `${row}/span ${duration}`,
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
