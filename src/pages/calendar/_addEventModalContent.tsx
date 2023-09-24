import { Dispatch, SetStateAction } from "react";
import { EventI } from "~/types/EventI";

function AddEventModalContent({
  setEvents,
}: {
  setEvents: Dispatch<SetStateAction<EventI[]>>;
}) {
  return <div>AddEventModalContent</div>;
}

export default AddEventModalContent;
