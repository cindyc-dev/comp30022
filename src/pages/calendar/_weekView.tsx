import { Moment } from "moment";
import { Dispatch, SetStateAction, useRef } from "react";
import { CalendarViewType } from "~/types/EventI";
import { arrayRange } from "./_utils";

const TIME_WIDTH = "3em";
const TIME_GAP = "10px";
const GRID_TEMPLATE_COLUMNS = `${TIME_WIDTH} 10px repeat(7, minmax(3rem, 1fr))`;

export default function WeekView({
  today,
  setToday,
  setView,
}: {
  today: Moment;
  setToday: Dispatch<SetStateAction<moment.Moment>>;
  setView: Dispatch<SetStateAction<CalendarViewType>>;
}) {
  // Make the Header and Body scroll together
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleScrollHeader = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = target.scrollLeft;
    }
  };

  const handleScrollBody = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (headerRef.current) {
      headerRef.current.scrollLeft = target.scrollLeft;
    }
  };

  return (
    <div className=" w-full">
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
        onScroll={handleScrollHeader}
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
                  today.isSame(currDate) ? "btn-primary" : "btn-ghost"
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
          gridTemplateRows: "repeat(48, 2em)",
        }}
        ref={bodyRef}
        onScroll={handleScrollBody}
      >
        {/* Times from 00:00 to 23:00 */}
        {arrayRange(0, 23).map((hour) => (
          <>
            <div className="row-span-2 text-right" style={{ gridColumn: 1 }}>
              <p className="m-0">{hour}:00</p>
            </div>
            <div className="row-span-2 border-b-2  border-base-200"></div>
          </>
        ))}
        {/* Fill rows with borders */}
        {arrayRange(3, 9, 1).map((col) =>
          arrayRange(1, 48, 2).map((row) => {
            return (
              <div
                className="row-span-2 border-b-2 border-l-2 border-base-200"
                style={{
                  gridColumn: col,
                  gridRowStart: row,
                  gridRowEnd: row + 2,
                }}
              >
                {row}, {col}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
