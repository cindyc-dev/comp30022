import moment from "moment";
import { EventI } from "~/types/EventI";

export const sampleEvents: EventI[] = [
  {
    id: "1",
    title: "Golf with John",
    startDateTime: moment("2023-09-24 09:00:00").toDate(),
    endDateTime: moment("2023-09-24 10:00:00").toDate(),
    location: "Golf Course",
    notes: "John is a great guy",
    relatedConnections: [
      {
        name: "John Doe",
        photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/23.jpg",
        email: "john.doe@example.com",
        tags: [],
      },
    ],
  },
  {
    id: "2",
    title: "Buy Gongcha",
    startDateTime: moment("2023-09-29 10:00:00").toDate(),
    endDateTime: moment("2023-09-29 12:00:00").toDate(),
    location: "Gongcha",
    notes: "Get the milk tea with pearls",
    relatedConnections: [],
  },
  {
    id: "3",
    title: "Dinner with Jane",
    startDateTime: moment("2023-09-29 18:00:00").toDate(),
    endDateTime: moment("2023-09-29 20:00:00").toDate(),
    location: "Jane's House",
    notes: "Jane is a great cook",
    relatedConnections: [
      {
        name: "Jane Doe",
        email: "jane@example.com",
        tags: [],
      },
    ],
  },
  {
    id: "4",
    title: "Overnight event",
    startDateTime: moment("2023-09-29 22:00:00").toDate(),
    endDateTime: moment("2023-09-30 08:00:00").toDate(),
    location: "My House",
    notes: "Bring sleeping bag",
    relatedConnections: [],
  },
  {
    id: "5",
    title: "Multi-day event",
    startDateTime: moment("2023-09-25 22:00:00").toDate(),
    endDateTime: moment("2023-09-28 08:00:00").toDate(),
    location: "My House",
    notes: "Bring sleeping bag",
    relatedConnections: [],
  },
];
