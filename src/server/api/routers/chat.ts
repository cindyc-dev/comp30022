import {
  addChatMessage,
  getAllChatMessages,
  markMessageAsRead,
} from "~/server/Repositories/ChatRepository";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ChatI } from "~/types/ChatI";
import { pusherServer } from "~/utils/pusherServer";

export const chatRouter = createTRPCRouter({
  // Send message to pusher
  sendChatMessage: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        senderId: z.string(),
        senderName: z.string(),
        receiverId: z.string(),
        receiverName: z.string(),
      })
    )
    .mutation(async (opts) => {
      const message = opts.input.message;
      const senderId = opts.input.senderId;
      const receiverId = opts.input.receiverId;
      const date = new Date();
      const chatMessage: ChatI = {
        id: Math.random().toString(36).substring(7),
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        createdAt: date,
        isRead: false,
      };

      // Send to sender
      pusherServer.trigger(receiverId, "chat", chatMessage);

      // Send to receiver
      pusherServer.trigger(senderId, "chat", chatMessage);

      console.log(`Message sent to ${senderId} and ${receiverId}`);

      // Store in database
      return addChatMessage(senderId, receiverId, message, date);
    }),

  // Get all messages
  getChatMessages: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async (opts) => {
      const userId = opts.input.userId;

      return getAllChatMessages(userId);
    }),

  // Mark message as read
  markMessageAsRead: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const messageId = opts.input.messageId;

      return markMessageAsRead(messageId);
    }),
});
