import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ChatI } from "~/types/ChatI";
import { getChannelId } from "~/utils/getChennelId";
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
      const chatMessage: ChatI = {
        id: Math.random().toString(36).substring(7),
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        time: new Date(),
      };

      console.log(
        `Sending message ${message} to ${getChannelId(senderId, receiverId)}`
      );

      pusherServer.trigger(
        getChannelId(senderId, receiverId),
        "chat",
        chatMessage
      );

      console.log("Message sent");
      return chatMessage;
    }),
});
