import { EventI } from "~/types/EventI";
import EventDetailsForm from "./_eventDetailsForm";
import { useState } from "react";
import { FaSave } from "react-icons/fa";

function EventDetailsModal({
  initialEvent,
  onSave,
}: {
  initialEvent: EventI;
  onSave: (event: EventI) => void;
}) {
  const [event, setEvent] = useState<EventI>(initialEvent);
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Event Details</h1>
      <EventDetailsForm event={event} setEvent={setEvent} />
      <button className="btn btn-primary mt-2" onClick={() => onSave(event)}>
        <FaSave />
        Save
      </button>
    </div>
  );
}

export default EventDetailsModal;
