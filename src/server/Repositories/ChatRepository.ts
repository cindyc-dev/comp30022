import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { tryCatchWrapper } from "~/utils/tryCatchWrapper";

const messageSelect = {
  id: true,
  message: true,
  createdAt: true,
  senderId: true,
  receiverId: true,
  isRead: true,
} satisfies Prisma.ChatMessageSelect;

export type ChatMessageI = Prisma.ChatMessageGetPayload<{
  select: typeof messageSelect;
}>;

export async function getAllChatMessages(
  userId: string
): Promise<ChatMessageI[]> {
  return await tryCatchWrapper(async () => {
    const sentMessages = await prisma.chatMessage.findMany({
      where: {
        senderId: userId,
      },
      select: messageSelect,
    });

    const receivedMessages = await prisma.chatMessage.findMany({
      where: {
        receiverId: userId,
      },
      select: messageSelect,
    });

    return [...sentMessages, ...receivedMessages];
  }, "Error retrieving messages.");
}

export async function addChatMessage(
  senderId: string,
  receiverId: string,
  message: string,
  createdAt: Date
): Promise<ChatMessageI | "error"> {
  return await tryCatchWrapper(async () => {
    const chatMessage = await prisma.chatMessage.create({
      data: {
        message: message,
        createdAt: createdAt,
        senderId: senderId,
        receiverId: receiverId,
        isRead: false,
      },
      select: messageSelect,
    });

    return chatMessage;
  }, "Error sending message.");
}

export async function markMessageAsRead(
  id: string
): Promise<ChatMessageI | "error"> {
  return await tryCatchWrapper(async () => {
    const chatMessage = await prisma.chatMessage.update({
      where: {
        id: id,
      },
      data: {
        isRead: true,
      },
      select: messageSelect,
    });

    return chatMessage;
  }, "Error marking message as read.");
}
