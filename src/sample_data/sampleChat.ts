import { ChatI } from "~/types/ChatI";

export const sampleChatHistory: ChatI[] = [
  {
    id: "1",
    connection: {
      id: "1",
      name: "John Doe",
      photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/23.jpg",
      email: "john.doe@example.com",
      tags: [],
    },
    isMe: false,
    message: "Hey, how are you doing?",
    time: new Date("2021-01-01T00:00:00.000Z"),
  },
  {
    id: "2",
    isMe: true,
    message: "I'm doing well, thanks for asking!",
    time: new Date("2021-01-01T00:00:00.000Z"),
  },
];
