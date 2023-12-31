import TextAreaInput from "~/components/common/textAreaInput";
import TextInput from "~/components/common/textInput";
import { EventI } from "~/types/EventI";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ColourPicker from "~/components/common/colourPicker";
import { ConnectionI } from "~/types/ConnectionI";
import { useToast } from "../hooks/toastContext";
import { api } from "~/utils/api";
import AvatarImage from "../common/avatarImage";
import { DEFAULT_PROFILE_PIC } from "~/sample_data/sampleConnections";
import { HiXMark } from "react-icons/hi2";

function EventDetailsForm({
  event,
  setEvent,
}: {
  event: EventI;
  setEvent: Dispatch<SetStateAction<EventI>>;
}) {
  const [allConnections, setAllConnections] = useState<ConnectionI[]>([]);

  // When start time changes, change end time to be previous duration later
  const handleStartTimeChange = (date: Date) => {
    const duration = moment(event.endDateTime).diff(
      moment(event.startDateTime),
      "minutes"
    );
    setEvent({
      ...event,
      startDateTime: date,
      endDateTime: moment(date).add(duration, "minutes").toDate(),
    });
  };

  // Display duration in XX hours, XX minutes
  const getDuration = () => {
    const duration = moment(event.endDateTime).diff(
      moment(event.startDateTime),
      "minutes"
    );
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hours`;
    return `${hours} hours, ${minutes} minutes`;
  };

  // Filter out times before the start time
  const filterTimeBeforeStart = (time: Date) => {
    return moment(time).isAfter(moment(event.startDateTime));
  };

  const { addToast } = useToast();

  const {
    data: connections,
    isLoading,
    error,
  } = api.connection.getAllConnections.useQuery();
  useEffect(() => {
    if (connections) {
      console.log({ connections: connections });
      setAllConnections([...connections]);
    }
    if (error) {
      console.error(error);
      addToast({
        type: "error",
        message: `Error fetching connections. ${error}: ${error.message}`,
      });
    }
  }, [connections, error]);

  console.log({ event: event });

  return (
    <div className="flex w-full flex-col">
      <TextInput
        label="📛 Event Name"
        value={event.title}
        setValue={(val) => setEvent({ ...event, title: val })}
        placeholder={"eg. Meeting with Jane"}
        required={true}
      />
      {/* Start and End Time */}
      <div className="flex w-full gap-2">
        <div className="flex w-full flex-col">
          <label>
            <span className="label-text">🕐Start Date/Time</span>
          </label>
          <DatePicker
            selected={event.startDateTime}
            onChange={(date) => handleStartTimeChange(date as Date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="time"
            dateFormat="dd/MM/yyyy hh:mm aa"
            className="input input-bordered w-full"
          />
        </div>
        <div className="flex w-full flex-col">
          <label>
            <span className="label-text">🕓End Date/Time</span>
          </label>
          <DatePicker
            selected={event.endDateTime}
            onChange={(date) =>
              setEvent({ ...event, endDateTime: date as Date })
            }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="time"
            dateFormat="dd/MM/yyyy hh:mm aa"
            className="input input-bordered w-full"
            filterTime={filterTimeBeforeStart}
          />
        </div>
      </div>
      <div className="self-end text-sm">Duration: {getDuration()}</div>
      <TextInput
        label="📍 Location"
        value={event.location || ""}
        setValue={(val) => setEvent({ ...event, location: val })}
        placeholder={"eg. Jane's Office"}
      />
      <TextAreaInput
        label="📝 Notes"
        value={event.notes || ""}
        setValue={(val) => setEvent({ ...event, notes: val })}
        placeholder={"eg. Bring the report"}
      />
      <div className="flex w-full justify-evenly gap-2">
        {/* Related Connections */}
        {isLoading && <span>Loading Related Connections</span>}
        {!isLoading && (
          <div className="w-full">
            <div className="w-full">
              <label className="label p-0">
                <span className="label-text">🧑‍🤝‍🧑 Related Connections</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => {
                  setEvent({
                    ...event,
                    relatedConnections: [
                      ...event.relatedConnections,
                      allConnections.filter(
                        (connection) => connection.name === e.target.value
                      )[0],
                    ],
                  });
                  // Reset the select to default
                  (e.target as HTMLSelectElement).selectedIndex = 0;
                }}
                defaultValue={"Choose Connection"}
              >
                <option disabled>Choose Connection</option>
                {/* Only show connections that aren't already added to relatedConnections */}
                {allConnections
                  .filter(
                    (connection) =>
                      !event.relatedConnections
                        .map((c) => c.id)
                        .includes(connection.id)
                  )
                  .map((connection) => (
                    <option key={connection.id} value={connection.name}>
                      {connection.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}
        {/* Colour Picker */}
        <div className="w-full">
          <label>
            <span className="label-text">🎨 Colour</span>
          </label>
          <ColourPicker
            colour={event.colour}
            setColour={(val) => setEvent({ ...event, colour: val })}
          />
        </div>
      </div>
      {/* Added Related Connections */}
      {event.relatedConnections.length > 0 && (
        <div className="my-2 flex flex-wrap gap-2">
          {event.relatedConnections.map((connection) => (
            <RelatedConnection
              key={connection.id}
              connection={connection}
              onDelete={() =>
                setEvent({
                  ...event,
                  relatedConnections: event.relatedConnections.filter(
                    (c) => c.id !== connection.id
                  ),
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventDetailsForm;

function RelatedConnection({
  connection,
  onDelete,
}: {
  connection: ConnectionI;
  onDelete: () => void;
}) {
  return (
    <div className="badge py-5">
      <label
        className="avatar tooltip h-7 w-7 rounded-full border-2 border-solid"
        data-tip={connection.name}
      >
        <AvatarImage
          src={connection.photoUrl ? connection.photoUrl : DEFAULT_PROFILE_PIC}
        />
      </label>
      <div className="px-1">{connection.name}</div>
      <HiXMark className="ml-1 cursor-pointer" onClick={onDelete} />
    </div>
  );
}
