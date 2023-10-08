import moment, { Moment } from "moment";
import { useModal } from "~/components/hooks/modalContext";
import { Layout } from "~/components/layout/layout";
import { sampleEvents } from "~/sample_data/sampleEvents";
import { CalendarViewType, EventI, EventStateI } from "~/types/EventI";
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
import { api } from "~/utils/api";

const DEFAULT_VIEW: CalendarViewType = "week";

export default function Calendar() {
  const [events, setEvents] = useState<EventStateI>({
    allEvents: [],
    weekEvents: [],
    monthEvents: [],
  });
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

  const addMutation = api.calendar.addEvent.useMutation();
  const handleAddEvent = (event: EventI) => {
    if (!event.title || !event.startDateTime || !event.endDateTime) {
      addToast({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }
    // TODO api call to add event
    const newEvent = {
      title: event.title,
      startDateTime: event.startDateTime.toISOString(),
      endDateTime: event.endDateTime.toISOString(),
      location: event.location,
      notes: event.notes,
      colour: event.colour,
    };
    addMutation.mutate(newEvent, {
      onSuccess: (data) => {
        console.log({ data });
        // Show success toast
        addToast({
          type: "success",
          message: `Event ${event.title} added successfully!`,
        });
        refetch();
      },
      onError: (error) => {
        console.log({ error });
        // Show error toast
        addToast({
          type: "error",
          message: `Event ${event.title} failed to add.`,
        });
      },
    });

    // Close modal
    closeModal("add-event-modal");
  };

  const handleDeleteEvent = (event: EventI) => {
    // TODO api call to delete event
    setEvents((prev) => prev.filter((e) => e.id !== event.id)); // TODO remove

    // Close modal
    closeModal("event-details-modal");
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

  // Get Events for the month - pass start and end as UTC strings
  const { data, isLoading, error, refetch } = api.calendar.getEvents.useQuery({
    start: today.clone().startOf("month").utc().format(),
    end: today.clone().endOf("month").utc().format(),
  });

  /* Get all events from API */
  useEffect(() => {
    if (data) {
      console.log({ apiData: data });
      setEvents({
        allEvents: data,
        weekEvents: getEventsInWeek(today, data, true),
        monthEvents: getEventsInMonth(today, data),
      });
    }
  }, [data]);

  // const weekEvents = getEventsInWeek(today, events, true);
  // const monthEvents = getEventsInMonth(today, events);

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
              weekEvents={events.weekEvents}
              overNightAndMultiDayEvents={...getOvernightAndMultiDayEvents(
                getEventsInWeek(today, events.allEvents, true),
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
            monthEvents={[...events.monthEvents]}
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
