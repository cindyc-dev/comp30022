import { ConnectionI } from "./ConnectionI";

export interface ChatI {
  id: string;
  senderId: string;
  receiverId: string;
  receiverConnection?: ConnectionI;
  message: string;
  createdAt: Date;
  isRead: boolean;
}
