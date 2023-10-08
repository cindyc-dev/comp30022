import { createTRPCRouter } from "~/server/api/trpc";
import {authRouter} from "~/server/api/routers/auth";
import { detailsRouter } from "./routers/userdetails";
import { trelloRouter } from "./routers/trello";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: authRouter,
  details: detailsRouter,
  trello: trelloRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
