import moment, { Moment } from "moment";
import { Dispatch, SetStateAction, useState } from "react";
import { BsGrid3X3 } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { HiOutlineViewColumns } from "react-icons/hi2";
import {
  MdCalendarViewDay,
  MdCalendarViewMonth,
  MdCalendarViewWeek,
  MdOutlineCalendarViewDay,
  MdToday,
} from "react-icons/md";
import { Layout } from "~/components/layout/layout";
import { sampleEvents } from "~/sample_data/sampleEvents";
import { CalendarViewType, EventI } from "~/types/EventI";

interface ViewOptionI {
  value: CalendarViewType;
  icon: JSX.Element;
}

const viewOptions: ViewOptionI[] = [
  {
    value: "day",
    icon: <MdCalendarViewDay className="text-lg" />,
  },
  {
    value: "week",
    icon: <MdCalendarViewWeek className="text-lg" />,
  },
  {
    value: "month",
    icon: <MdCalendarViewMonth className="text-lg" />,
  },
];

export default function Calendar() {
  const [events, setEvents] = useState<EventI[]>(sampleEvents);
  const [view, setView] = useState<CalendarViewType>("week");
  const [today, setToday] = useState<Moment>(moment());

  const getHeaderDate = () => {
    switch (view) {
      case "month":
        return today.format("MMMM YYYY");
      case "week":
        return `${today.startOf("week").format("MMM Do")} - ${today
          .endOf("week")
          .format("MMM Do")}`;
      case "day":
        return today.format("Do MMM YYYY");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mt-4 flex w-full items-center justify-between align-middle">
        <div className="flex items-center justify-center gap-2 align-middle">
          <button
            className="btn btn-square btn-sm"
            onClick={() => {
              setToday(today.clone().subtract(1, view));
            }}
          >
            <FaAngleLeft />
          </button>
          <button
            className="btn btn-square btn-sm"
            onClick={() => {
              setToday(today.clone().add(1, view));
            }}
          >
            <FaAngleRight />
          </button>
          <button
            className="btn btn-sm"
            onClick={() => {
              setToday(moment());
            }}
          >
            <MdToday /> Today
          </button>
          <h2 className="m-0">{getHeaderDate()}</h2>
        </div>
        <div className="flex items-center gap-1">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              className={`btn btn-circle ${
                option.value === view ? "btn-secondary" : "btn-ghost"
              }`}
              onClick={() => setView(option.value)}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>
      {/* Calendar View */}
      <div className="m-2 w-full">
        {view === "week" && (
          <WeekView today={today} setToday={setToday} setView={setView} />
        )}
        {view === "month" && <MonthView today={today} />}
        {view === "day" && <DayView today={today} />}
      </div>
    </Layout>
  );
}

const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

function WeekView({
  today,
  setToday,
  setView,
}: {
  today: Moment;
  setToday: Dispatch<SetStateAction<moment.Moment>>;
  setView: Dispatch<SetStateAction<CalendarViewType>>;
}) {
  return (
    <div className="w-full">
      <div className="sticky top-16 z-30 h-2 bg-base-100"></div>
      <div
        className="sticky top-[4.5rem] z-40 grid w-full place-content-center rounded bg-secondary py-2"
        style={{
          gridTemplateColumns: "3em 10px repeat(7, 1fr)",
          boxShadow: "0px 15px 10px -15px #ececec",
        }}
      >
        {/* Fillers */}
        <div></div>
        <div></div>
        {/* Days and Dates from Sunday to Saturday */}
        {Array.from(Array(7).keys()).map((day) => {
          const currDate = today.startOf("week").clone().add(day, "day");
          return (
            <div key={day} className="border-l-2 border-base-100 text-center">
              <p className="m-0">
                {today
                  .startOf("week")
                  .clone()
                  .add(day, "day")
                  .format("ddd")
                  .toUpperCase()}
              </p>
              <button
                className={`btn btn-circle ${
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
        className="grid w-full"
        style={{
          gridTemplateColumns: "3em 10px repeat(7, 1fr)",
          gridTemplateRows: "repeat(48, 2em)",
        }}
      >
        {/* Times from 00:00 to 23:00 */}
        {Array.from(Array(24).keys()).map((hour) => (
          <>
            <div className="row-span-2 text-right" style={{ gridColumn: "1" }}>
              <p className="m-0">{hour}:00</p>
            </div>
            <div className="row-span-2 border-b-2  border-base-200"></div>
          </>
        ))}
        {/* Fill rows with borders */}
        {arrayRange(3, 9, 1).map((col) =>
          arrayRange(1, 48, 2).map((row) => (
            <div
              className="row-span-2 border-b-2 border-l-2 border-base-200"
              style={{
                gridColumn: col,
                gridRowStart: row,
                gridRowEnd: row + 2,
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

function MonthView({ today }: { today: Moment }) {
  return <div className="grid grid-cols-7 gap-1"></div>;
}

function DayView({ today }: { today: Moment }) {
  return (
    <div>
      <h2 className="m-0">{today.format("Do MMM YYYY")}</h2>
    </div>
  );
}

Calendar.auth = false;
