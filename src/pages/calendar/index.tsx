import moment, { Moment } from "moment";
import { useModal } from "~/components/hooks/modalContext";
import { Layout } from "~/components/layout/layout";
import { CalendarViewType, EventI, EventStateI } from "~/types/EventI";
import AddEventModalContent from "~/components/calendar/addEventModalContent";
import WeekView from "~/components/calendar/weekView";
import { useCallback, useEffect, useRef, useState } from "react";
import Toolbar from "~/components/calendar/toolbar";
import {
  getEventsInDay,
  getEventsInMonth,
  getEventsInWeek,
  getOverWeekEvents,
  getOvernightAndMultiDayEvents,
} from "~/components/calendar/utils";
import MonthView from "~/components/calendar/monthView";
import { useToast } from "~/components/hooks/toastContext";
import { FaPlus } from "react-icons/fa";
import EventDetailsModal from "~/components/calendar/eventDetailsModal";
import { api } from "~/utils/api";
import DayView from "~/components/calendar/dayView";

const DEFAULT_VIEW: CalendarViewType = "week";

export default function Calendar() {
  const [events, setEvents] = useState<EventStateI>({
    allEvents: [],
    weekEvents: [],
    monthEvents: [],
    dayEvents: [],
  });
  const [view, setView] = useState<CalendarViewType>();
  const [today, setToday] = useState<Moment>(moment());
  const prevTodayRef = useRef<Moment>(moment());

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
            handleEditEvent(event);
            closeModal("event-details-modal");
          }}
          handleDeleteEvent={handleDeleteEvent}
        />
      ),
      id: "event-details-modal",
    });
  };

  const { addToast } = useToast();

  /* Add Event */
  const addMutation = api.calendar.addEvent.useMutation();
  const handleAddEvent = (event: EventI) => {
    if (!event.title || !event.startDateTime || !event.endDateTime) {
      addToast({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }
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

  /* Delete Event */
  const deleteMutation = api.calendar.deleteEvent.useMutation();
  const handleDeleteEvent = (event: EventI) => {
    deleteMutation.mutate(
      { id: event.id },
      {
        onSuccess: (data) => {
          console.log({ data });
          // Show success toast
          addToast({
            type: "success",
            message: `Event ${event.title} deleted successfully!`,
          });
          refetch();
        },
        onError: (error) => {
          console.log({ error });
          // Show error toast
          addToast({
            type: "error",
            message: `Event ${event.title} failed to delete. Error: ${error.message}`,
          });
        },
      }
    );

    // Close modal
    closeModal("event-details-modal");
  };

  /* Edit Event */
  const editMutation = api.calendar.editEvent.useMutation();
  const handleEditEvent = (event: EventI) => {
    const newEvent = {
      id: event.id,
      title: event.title,
      startDateTime: event.startDateTime.toISOString(),
      endDateTime: event.endDateTime.toISOString(),
      location: event.location,
      notes: event.notes,
      colour: event.colour,
      relatedExistingConnections: event.relatedConnections
        .filter((c) => c.isExisting)
        .map((c) => c.id),
      relatedCustomConnections: event.relatedConnections
        .filter((c) => !c.isExisting)
        .map((c) => c.email),
    };
    editMutation.mutate(newEvent, {
      onSuccess: (data) => {
        console.log({ data });
        // Show success toast
        addToast({
          type: "success",
          message: `Event ${event.title} edited successfully!`,
        });
        refetch();
      },
      onError: (error) => {
        console.log({ error });
        // Show error toast
        addToast({
          type: "error",
          message: `Event ${event.title} failed to edit. Error: ${error.message}`,
        });
      },
    });

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
    if (event.key === "t") {
      setToday(moment());
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

  /* Get all events from API */
  // Get Events for the month - pass start and end as UTC strings
  const { data, isLoading, error, refetch } = api.calendar.getEvents.useQuery({
    start: today.clone().startOf("year").utc().format(),
    end: today.clone().endOf("year").utc().format(),
  });
  useEffect(() => {
    if (data) {
      console.log({ apiData: data });
      setEvents({
        allEvents: data,
        weekEvents: getEventsInWeek(today, data, true),
        monthEvents: getEventsInMonth(today, data, true),
        dayEvents: getEventsInDay(today, data, true),
      });
    }
    if (error) {
      console.log({ error });
      // Show error toast
      addToast({
        type: "error",
        message: `Failed to get events. Error: ${error.message}`,
      });
    }
  }, [data, error]);

  useEffect(() => {
    setEvents((prev) => ({
      ...prev,
      weekEvents: getEventsInWeek(today.clone(), prev.allEvents, true),
      monthEvents: getEventsInMonth(today.clone(), prev.allEvents, true),
      dayEvents: getEventsInDay(today.clone(), prev.allEvents, true),
    }));
  }, [events.allEvents, today]);

  useEffect(() => {
    prevTodayRef.current = today;

    // Refetch if year changes
    if (!today.isSame(prevTodayRef.current, "year")) {
      console.log("refetch");
      refetch();
    }
  }, [today]);

  const goToDay = (day: Moment) => {
    setToday(day.clone());
    setView("day");
  };

  return (
    <Layout>
      <Toolbar
        today={today.clone()}
        setToday={setToday}
        view={view || DEFAULT_VIEW}
        setView={setView}
        openEventModal={openEventModal}
        isLoading={isLoading}
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
              today={today.clone()}
              goToDay={goToDay}
              weekEvents={events.weekEvents}
              overNightAndMultiDayEvents={...getOvernightAndMultiDayEvents(
                getEventsInWeek(today.clone(), events.allEvents, true),
                today.clone().startOf("week"),
                today.clone().endOf("week")
              )}
              handleEventClick={openEventDetailsModal}
            />
          </>
        )}
        {view === "month" && (
          <MonthView
            today={today.clone()}
            goToDay={goToDay}
            monthEvents={events.monthEvents}
            handleEventClick={openEventDetailsModal}
            overWeeksEvents={getOverWeekEvents(events.allEvents, today.clone())}
          />
        )}
        {view === "day" && (
          <DayView
            today={today.clone()}
            dayEvents={[...events.dayEvents]}
            handleEventClick={openEventDetailsModal}
            overNightAndMultiDayEvents={...getOvernightAndMultiDayEvents(
              getEventsInDay(today.clone(), events.allEvents, true),
              today.clone().startOf("day"),
              today.clone().endOf("day")
            )}
          />
        )}
      </div>
    </Layout>
  );
}

Calendar.auth = true;
