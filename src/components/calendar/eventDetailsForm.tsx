import TextAreaInput from "~/components/common/textAreaInput";
import TextInput from "~/components/common/textInput";
import { EventI } from "~/types/EventI";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import ColourPicker from "~/components/common/colourPicker";

function EventDetailsForm({
  event,
  setEvent,
}: {
  event: EventI;
  setEvent: Dispatch<SetStateAction<EventI>>;
}) {
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

  const filterTimeBeforeStart = (time: Date) => {
    return moment(time).isAfter(moment(event.startDateTime));
  };
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
      {/* TODO related connections */}
      <label>
        <span className="label-text">🎨 Colour</span>
      </label>
      <ColourPicker
        colour={event.colour}
        setColour={(val) => setEvent({ ...event, colour: val })}
      />
    </div>
  );
}

export default EventDetailsForm;
