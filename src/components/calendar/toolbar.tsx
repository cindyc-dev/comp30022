import moment, { Moment } from "moment";
import React, { Dispatch, SetStateAction } from "react";
import { FaAngleLeft, FaAngleRight, FaPlus } from "react-icons/fa";
import {
  MdCalendarViewDay,
  // MdCalendarViewMonth,
  MdCalendarViewWeek,
  MdToday,
} from "react-icons/md";
import { CalendarViewType } from "~/types/EventI";

interface ToolbarProps {
  today: Moment;
  setToday: Dispatch<SetStateAction<Moment>>;
  view: CalendarViewType;
  setView: Dispatch<SetStateAction<CalendarViewType | undefined>>;
  openEventModal: () => void;
  isLoading?: boolean;
}

interface ViewOptionI {
  value: CalendarViewType;
  icon: JSX.Element;
}

const VIEW_OPTIONS: ViewOptionI[] = [
  {
    value: "day",
    icon: <MdCalendarViewDay className="text-lg" />,
  },
  {
    value: "week",
    icon: <MdCalendarViewWeek className="text-lg" />,
  },
  // {
  //   value: "month",
  //   icon: <MdCalendarViewMonth className="text-lg" />,
  // },
];

function Toolbar({
  today,
  setToday,
  view,
  setView,
  openEventModal,
  isLoading = false,
}: ToolbarProps) {
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
    <div className="mt-4 flex w-full flex-col justify-between gap-2 align-middle md:flex-row md:items-center">
      <div className="flex gap-2 md:items-center">
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
        <h3 className="m-0">{getHeaderDate()}</h3>
        {isLoading && (
          <span className="loading loading-spinner loading-md"></span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button className="btn btn-primary" onClick={openEventModal}>
          <FaPlus />
          Create Event
        </button>
        {VIEW_OPTIONS.map((option) => (
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
  );
}

export default Toolbar;
