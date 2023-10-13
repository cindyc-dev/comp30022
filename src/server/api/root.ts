import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import { connectionRouter } from "~/server/api/routers/connection";
import { detailsRouter } from "./routers/userdetails";
import { calendarRouter } from "~/server/api/routers/calendar";
import { trelloRouter } from "./routers/trello";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: authRouter,
  connection: connectionRouter,
  details: detailsRouter,
  calendar: calendarRouter,
  trello: trelloRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
