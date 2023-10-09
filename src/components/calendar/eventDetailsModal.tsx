import { EventI } from "~/types/EventI";
import EventDetailsForm from "./eventDetailsForm";
import { useEffect, useState } from "react";
import { FaSave, FaTrash } from "react-icons/fa";

function EventDetailsModal({
  initialEvent,
  onSave,
  handleDeleteEvent,
}: {
  initialEvent: EventI;
  onSave: (event: EventI) => void;
  handleDeleteEvent: (event: EventI) => void;
}) {
  const [event, setEvent] = useState<EventI>(initialEvent);

  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    // Check if event is valid
    setIsValid(
      event.title !== "" &&
        event.startDateTime !== null &&
        event.endDateTime !== null
    );
  }, [event]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Event Details</h1>
      <EventDetailsForm event={event} setEvent={setEvent} />
      <div className="mt-2 flex w-full justify-end gap-2">
        {/* Disable Save button if event is invalid */}
        <button
          className={`btn btn-primary  ${!isValid && "btn-disabled"}`}
          onClick={() => onSave(event)}
        >
          <FaSave />
          Save
        </button>
        <button
          className="btn btn-error"
          onClick={() => handleDeleteEvent(event)}
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  );
}

export default EventDetailsModal;
