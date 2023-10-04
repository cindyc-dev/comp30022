import moment, { Moment } from "moment";
import { useModal } from "~/components/hooks/modalContext";
import { Layout } from "~/components/layout/layout";
import { sampleEvents } from "~/sample_data/sampleEvents";
import { CalendarViewType, EventI } from "~/types/EventI";
import AddEventModalContent from "~/components/calendar/_addEventModalContent";
import WeekView from "~/components/calendar/_weekView";
import { useCallback, useEffect, useState } from "react";
import Toolbar from "~/components/calendar/_toolbar";
import {
  getEventsInMonth,
  getEventsInWeek,
  getOvernightAndMultiDayEvents,
} from "~/components/calendar/_utils";
import MonthView from "~/components/calendar/_monthView";
import { useToast } from "~/components/hooks/toastContext";
import { FaPlus } from "react-icons/fa";
import EventDetailsModal from "~/components/calendar/_eventDetailsModal";

const DEFAULT_VIEW: CalendarViewType = "week";

export default function Calendar() {
  const [events, setEvents] = useState<EventI[]>(sampleEvents);
  const [view, setView] = useState<CalendarViewType>();
  const [today, setToday] = useState<Moment>(moment());

  const { openModal, closeModal } = useModal();

  // Open Add Event Modal
  const openEventModal = () => {
    openModal({
      content: <AddEventModalContent handleAddEvent={handleAddEvent} />,
      id: "add-event-modal",
    });
  };

  // Open Event Details Modal
  const openEventDetailsModal = (event: EventI) => {
    openModal({
      content: (
        <EventDetailsModal
          initialEvent={event}
          onSave={(event) => {
            closeModal("event-details-modal");
            setEvents((prev) =>
              prev.map((e) => (e.id === event.id ? event : e))
            );
          }}
          handleDeleteEvent={handleDeleteEvent}
        />
      ),
      id: "event-details-modal",
    });
  };

  const { addToast } = useToast();

  const handleAddEvent = (event: EventI) => {
    if (!event.title || !event.startDateTime || !event.endDateTime) {
      addToast({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }
    // Close modal
    closeModal("add-event-modal");

    setEvents((prev) => [...prev, event]);
  };

  const handleDeleteEvent = (event: EventI) => {
    // Close modal
    closeModal("event-details-modal");

    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  /* Using arrow keys to navigate calendar and D, M, W for changing views */
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Getting from local storage because state is not updated in injected event listener
    const view = localStorage.getItem("calendar-view") as CalendarViewType;

    // Make sure we are not typing in an input field
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    if (event.key === "ArrowLeft") {
      setToday((prev) => prev.clone().subtract(1, view));
    }
    if (event.key === "ArrowRight") {
      setToday((prev) => prev.clone().add(1, view));
    }
    if (event.key === "d") {
      setView("day");
    }
    if (event.key === "w") {
      setView("week");
    }
    if (event.key === "m") {
      setView("month");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  /* Save and retrieve view in local storage */
  useEffect(() => {
    const view = localStorage.getItem("calendar-view");
    if (view) {
      setView(view as CalendarViewType);
    }
  }, []);

  useEffect(() => {
    if (view) {
      localStorage.setItem("calendar-view", view);
    }
  }, [view]);

  const weekEvents = getEventsInWeek(today, events);
  const monthEvents = getEventsInMonth(today, events);

  const goToDay = (day: Moment) => {
    setToday(day.clone());
    setView("day");
  };

  return (
    <Layout>
      <Toolbar
        today={today}
        setToday={setToday}
        view={view || DEFAULT_VIEW}
        setView={setView}
        openEventModal={openEventModal}
      />
      {/* Calendar View */}
      <div className="m-2 w-full">
        {view === "week" && (
          <>
            {/* Static Create Event Button at bottom right corner but don't exceed layout */}
            <div className="sticky top-40 z-40 flex h-0 w-full justify-end bg-base-100 md:top-44">
              <button
                className="btn btn-circle btn-primary mr-2 mt-2"
                onClick={openEventModal}
              >
                <FaPlus />
              </button>
            </div>
            <WeekView
              today={today}
              goToDay={goToDay}
              weekEvents={weekEvents}
              overNightAndMultiDayEvents={...getOvernightAndMultiDayEvents(
                getEventsInWeek(today, events, true),
                today.clone().startOf("week"),
                today.clone().endOf("week")
              )}
              handleEventClick={openEventDetailsModal}
            />
          </>
        )}
        {view === "month" && (
          <MonthView
            today={today}
            goToDay={goToDay}
            monthEvents={[...monthEvents]}
            handleEventClick={openEventDetailsModal}
          />
        )}
        {view === "day" && <DayView today={today} />}
      </div>
    </Layout>
  );
}

function DayView({ today }: { today: Moment }) {
  return (
    <div>
      <h2 className="m-0">{today.format("Do MMM YYYY")}</h2>
    </div>
  );
}

Calendar.auth = false;
