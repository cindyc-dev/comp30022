import moment, { Moment } from "moment";
import { useModal } from "~/components/hooks/modalContext";
import { Layout } from "~/components/layout/layout";
import { sampleEvents } from "~/sample_data/sampleEvents";
import { CalendarViewType, EventI } from "~/types/EventI";
import AddEventModalContent from "./_addEventModalContent";
import WeekView from "./_weekView";
import { useState } from "react";
import Toolbar from "./_toolbar";

export default function Calendar() {
  const [events, setEvents] = useState<EventI[]>(sampleEvents);
  const [view, setView] = useState<CalendarViewType>("week");
  const [today, setToday] = useState<Moment>(moment());

  const { openModal } = useModal();

  const openEventModal = () => {
    openModal({
      content: <AddEventModalContent setEvents={setEvents} />,
      id: "add-event-modal",
    });
  };

  return (
    <Layout>
      <Toolbar
        today={today}
        setToday={setToday}
        view={view}
        setView={setView}
        openEventModal={openEventModal}
      />
      {/* Calendar View */}
      <div className="m-2 w-full">
        {view === "week" && (
          <WeekView
            today={today}
            setToday={setToday}
            setView={setView}
            weekEvents={events}
          />
        )}
        {view === "month" && <MonthView today={today} />}
        {view === "day" && <DayView today={today} />}
      </div>
    </Layout>
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
