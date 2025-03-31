import { initResumeApp } from "../../resume";
import { router as initTRPCRouter } from "../trpc";
import { initExperienceRouter } from "./experience";
import { initEducationRouter } from "./education";
import * as trpcExpress from "@trpc/server/adapters/express";
import { initSkillRouter } from "./skill";

// created for each request
export const createContext = (
  _args: trpcExpress.CreateExpressContextOptions
) => ({}); // no context

export type Context = Awaited<ReturnType<typeof createContext>>;

export function initAppRouter() {
  const controller = initResumeApp();

  const appRouter = initTRPCRouter({
    experience: initExperienceRouter(controller.experience),
    education: initEducationRouter(controller.education),
    skill: initSkillRouter(controller.skill),
  });
  return appRouter;
}

export type AppRouter = ReturnType<typeof initAppRouter>;
