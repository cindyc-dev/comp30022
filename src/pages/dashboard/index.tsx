import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DayView from "~/components/calendar/dayView";
import {
  getEventsInDay,
  getOvernightAndMultiDayEvents,
} from "~/components/calendar/utils";
import { useToast } from "~/components/hooks/toastContext";
import { Layout } from "~/components/layout/layout";
import { EventI } from "~/types/EventI";
import { TaskI } from "~/types/TaskI";
import { api } from "~/utils/api";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <Layout>
      <h1 className="mt-2">Welcome, {session?.user.name}</h1>
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <div className="w-full">
          <h2 className="m-0 mb-2">Today's Events</h2>
          <div className="hide-scrollbar h-[70vh] overflow-auto rounded-xl bg-secondary">
            <Link
              href="/calendar"
              className="cursor-pointer font-normal no-underline"
            >
              <Calendar />
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 overflow-auto">
          <div className="rounded-xl bg-secondary p-3 px-5">
            <h2 className="m-0 p-0">Trello Tasks</h2>
            <div className="hide-scrollbar flex overflow-x-auto">
              <TrelloTasks />
            </div>
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

  if (isLoading) return <span className="loading loading-spinner"></span>;

  return (
    <DayView
      today={moment().clone()}
      dayEvents={dayEvents}
      handleEventClick={() => {}}
      overNightAndMultiDayEvents={getOvernightAndMultiDayEvents(
        getEventsInDay(moment().clone(), dayEvents, true),
        moment().clone().startOf("day"),
        moment().clone().endOf("day")
      )}
      scrollToTime={false}
      isDashboard={true}
    />
  );
}

function TrelloTasks() {
  const [tasks, setTasks] = useState<TaskI[]>([]);

  const { addToast } = useToast();

  const { data, isLoading, error } = api.trello.getTask.useQuery();
  useEffect(() => {
    if (data) {
      setTasks(
        data.map((task) => ({
          ...task,
          description: task.description || undefined,
          dueDate: task.dueDate || undefined,
        }))
      );
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

  if (isLoading) return <span className="loading loading-spinner"></span>;

  return (
    <div className="mt-2 flex gap-2">
      {tasks.map((task) => (
        <Link className="cursor-pointer" href="/trello">
          <div className="flex h-[7rem] w-[15rem] flex-col justify-between overflow-clip rounded-xl bg-primary p-2 text-base-100">
            <div>
              <div className="truncate font-semibold text-base-100">
                {task.title}
              </div>
              {task.description && (
                <div className="truncate text-sm">{task.description}</div>
              )}
              {task.dueDate && (
                <div className="text-sm">
                  📅 {moment(task.dueDate).format("DD/MM/YYYY")}
                </div>
              )}
            </div>
            <div className="flex w-full justify-end">
              <FaArrowRight />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

Dashboard.auth = true;
