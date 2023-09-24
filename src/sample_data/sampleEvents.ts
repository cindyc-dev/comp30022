import moment from "moment";
import { EventI } from "~/types/EventI";

export const sampleEvents: EventI[] = [
  {
    title: "Golf with John",
    startDateTime: moment("2023-09-20 09:00:00").toDate(),
    endDateTime: moment("2023-09-20 10:00:00").toDate(),
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
    title: "Buy Gongcha",
    startDateTime: moment("2023-09-23 09:00:00").toDate(),
    endDateTime: moment("2023-09-23 10:00:00").toDate(),
    location: "Gongcha",
    notes: "Get the milk tea with pearls",
    relatedConnections: [],
  },
];
