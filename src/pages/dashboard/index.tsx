import moment from "moment";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import DayView from "~/components/calendar/dayView";
import {
  getEventsInDay,
  getOvernightAndMultiDayEvents,
} from "~/components/calendar/utils";
import { useToast } from "~/components/hooks/toastContext";
import { Layout } from "~/components/layout/layout";
import { EventI } from "~/types/EventI";
import { api } from "~/utils/api";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <Layout>
      <h1 className="mt-2">Welcome, {session?.user.name}</h1>
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <div className="w-full">
          <h2 className="m-0 mb-2">Today's Events</h2>
          <div className="hide-scrollbar h-[70vh] overflow-auto rounded-xl bg-secondary">
            <Calendar />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <div className="rounded-xl bg-secondary p-3">
            <h2 className="m-0 p-0">Trello Tasks</h2>
            <div className="hide-scrollbar flex overflow-x-auto"></div>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <h2 className="m-0 p-0">Keep in touch...</h2>
            <div className="hide-scrollbar flex overflow-x-auto"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Calendar() {
  const [dayEvents, setDayEvents] = useState<EventI[]>([]);
  const { data, isLoading, error } = api.calendar.getEvents.useQuery({
    start: moment().clone().startOf("day").toISOString(),
    end: moment().clone().endOf("day").toISOString(),
  });

  const { addToast } = useToast();

  useEffect(() => {
    if (data) {
      console.log({ apiData: data });
      setDayEvents(getEventsInDay(moment().clone(), data, true));
    }
    if (error) {
      console.error(error);
      // Show error toast
      addToast({
        type: "error",
        message: `Failed to get events. Error: ${error.message}`,
      });
    }
  }, [data, error]);

  return (
    <>
      {isLoading && <span className="loading loading-spinner"></span>}
      {!isLoading && (
        <DayView
          today={moment().clone()}
          dayEvents={dayEvents}
          handleEventClick={(event: EventI) => {
            console.log(event);
            // Go to calendar page at /calendar
          }}
          overNightAndMultiDayEvents={getOvernightAndMultiDayEvents(
            getEventsInDay(moment().clone(), dayEvents, true),
            moment().clone().startOf("day"),
            moment().clone().endOf("day")
          )}
          scrollToTime={false}
          isDashboard={true}
        />
      )}
    </>
  );
}



Dashboard.auth = true;
