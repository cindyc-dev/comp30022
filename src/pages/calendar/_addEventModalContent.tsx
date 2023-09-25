import moment from "moment";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { EventI } from "~/types/EventI";
import "react-datepicker/dist/react-datepicker.css";
import EventDetailsForm from "./_eventDetailsForm";

function AddEventModalContent({
  handleAddEvent,
}: {
  handleAddEvent: (event: EventI) => void;
}) {
  const startDateTime = moment().add(30 - (moment().minute() % 30), "minutes");
  const [event, setEvent] = useState<EventI>({
    id: "",
    title: "",
    startDateTime: startDateTime.toDate(), // start time to the nearest 30 minutes
    endDateTime: startDateTime.clone().add(1, "hour").toDate(), // 1 hour after start
    location: "",
    notes: "",
    relatedConnections: [],
    colour: "red",
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-0">Add Event</h1>
      <div className="flex flex-col md:w-4/5">
        <EventDetailsForm event={event} setEvent={setEvent} />
        <button
          className="btn btn-primary mt-2"
          onClick={() => handleAddEvent(event)}
        >
          <FaPlus />
          Add Event
        </button>
      </div>
    </div>
  );
}

export default AddEventModalContent;
