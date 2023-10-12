import { ConnectionI } from "./ConnectionI";

export interface ChatI {
  id: string;
  connection?: ConnectionI;
  isMe: boolean;
  message: string;
  time: Date;
}
