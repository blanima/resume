import { initTRPC } from "@trpc/server";

// create TRPC instance
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
