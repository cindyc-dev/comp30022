import { Moment } from "moment";
import { arrayRange, handleScroll } from "./_utils";
import { Dispatch, SetStateAction, useRef } from "react";
import { CalendarViewType, EventI } from "~/types/EventI";
import moment from "moment";

interface MonthViewProps {
  today: Moment;
  setToday: Dispatch<SetStateAction<Moment>>;
  setView: Dispatch<SetStateAction<CalendarViewType | undefined>>;
  monthEvents: EventI[];
}

const GRID_TEMPLATE_COLUMNS = "repeat(7, minmax(3rem, 1fr))";
const GRID_TEMPLATE_ROWS = "repeat(5, minmax(15vh, 1fr))";

export default function MonthView({
  today,
  setToday,
  setView,
  monthEvents,
}: MonthViewProps) {
  // Make the Header and Body scroll together
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const monthStart = today.clone().startOf("month");

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
              >
                <button
                  className={`btn btn-circle btn-sm m-0 whitespace-nowrap text-sm ${
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
                  {currDate.isSame(currDate.clone().startOf("month"))
                    ? currDate.format("MMM DD")
                    : currDate.format("DD")}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
