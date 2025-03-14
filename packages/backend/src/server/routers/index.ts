import { initResumeApp } from "../../resume";
import { router as initTRPCRouter } from "../trpc";
import { initExperienceRouter } from "./experience";
import * as trpcExpress from "@trpc/server/adapters/express";

// created for each request
export const createContext = (
  _args: trpcExpress.CreateExpressContextOptions
) => ({}); // no context

export type Context = Awaited<ReturnType<typeof createContext>>;

export function initAppRouter() {
  const controller = initResumeApp();

  const appRouter = initTRPCRouter({
    experience: initExperienceRouter(controller),
  });
  return appRouter;
}

export type AppRouter = ReturnType<typeof initAppRouter>;
