import moment from "moment";
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
import { ConnectionI } from "~/types/ConnectionI";
import AvatarImage from "~/components/common/avatarImage";
import Tag from "~/components/connections/_tag";
import { sampleTags } from "~/sample_data/sampleConnections";
import Image from "next/image";

export default function Dashboard() {
  const { data: user } = api.details.profile.useQuery();

  return (
    <Layout>
      <div className="my-4 flex w-full flex-col">
        <h1 className="text-center">Welcome, {user?.name} 👋</h1>
        <div className="flex w-full flex-col gap-7 md:flex-row">
          {/* Calendar */}
          <div className="w-full max-w-md">
            <div className="md:hide-scrollbar show-scrollbar h-[34.5rem] overflow-auto rounded-xl bg-secondary">
              <Link
                href="/calendar"
                className="cursor-pointer font-normal no-underline"
              >
                <Calendar />
              </Link>
            </div>
          </div>

          <div className="flex w-full max-w-full flex-col gap-7 overflow-auto">
            {/* Trello Tasks */}
            <div className="rounded-xl bg-secondary p-7">
              <h2 className="m-0 p-0">Trello Tasks</h2>
              <div className="md:hide-scrollbar show-scrollbar flex overflow-x-auto">
                <TrelloTasks />
              </div>
            </div>
            {/* Keep in Touch */}
            <div className="rounded-xl bg-secondary p-7">
              <h2 className="m-0 p-0">Keep in touch...</h2>
              <div className="md:hide-scrollbar show-scrollbar flex overflow-x-auto">
                <KeepInTouch />
              </div>
            </div>
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
        <div
          className="flex h-[8rem] w-[15rem] flex-col justify-between overflow-clip rounded-xl bg-primary p-3 text-base-100"
          key={task.id}
        >
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
          <Link className="cursor-pointer" href="/trello">
            <div className="flex w-full justify-end text-base-100">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="">
          <Image
            src="/svg/Empty-pana.svg"
            alt="No tasks"
            width={150}
            height={150}
            className="m-0 p-0"
          />
          <p className="m-0 p-0 text-center">
            No tasks found! Head over to the <Link href="/trello">Trello</Link>{" "}
            page to create new tasks!
          </p>
        </div>
      )}
    </div>
  );
}

function KeepInTouch() {
  const [connections, setConnections] = useState<ConnectionI[]>([]);
  const { data, isLoading, error } =
    api.connection.getAllConnections.useQuery();

  const { addToast } = useToast();

  useEffect(() => {
    if (data) {
      setConnections(data);
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
      {connections.map((connection, i) => (
        <div
          className="flex h-[13rem] w-[15rem] flex-col justify-between overflow-clip rounded-xl bg-[#282B40] p-3 text-base-100"
          key={i}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="avatar h-[3.5rem] w-[3.5rem] rounded-full border-2 border-solid">
                <AvatarImage src={connection.photoUrl} />
              </label>
              <div className="font-semibold">{connection.name}</div>
            </div>
            <div className="flex w-full flex-col items-center">
              <div className="truncate text-sm">📧 {connection.email}</div>
              {connection.phone && (
                <div className="truncate text-sm">📞 {connection.phone}</div>
              )}
              {connection.notes && (
                <div className="truncate text-sm">✏️ {connection.notes}</div>
              )}
            </div>
            <div className="flex gap-2 truncate">
              {connection.tags.map((tag) => (
                <Tag
                  key={tag}
                  tag={tag}
                  tagColoursMap={sampleTags}
                  isDeletable={false}
                  xs={true}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Link href="/connections" className="cursor-pointer text-base-100">
              <FaArrowRight />
            </Link>
          </div>
        </div>
      ))}
      {connections.length === 0 && (
        <div className="flex w-full flex-col items-center">
          <Image
            src="/svg/Empty-pana.svg"
            alt="No tasks"
            width={150}
            height={150}
            className="m-0 p-0"
          />
          <p className="m-0 p-0 text-center">
            No connections found! Head over to the{" "}
            <Link href="/connections">Connections</Link> page to create new
            tasks!
          </p>
        </div>
      )}
    </div>
  );
}

Dashboard.auth = true;
