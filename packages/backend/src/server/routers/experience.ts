import { makeErrorResponse, makeSuccessResponse } from "@resume/core/src";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { type ExperienceController } from "src/application/presenters/controller/experience";

export function initExperienceRouter(
  experienceController: ExperienceController
) {
  const experienceRouter = router({
    get: publicProcedure
      .meta({ description: "Gets an experience by id" })
      .input(z.string().nonempty().uuid())
      .query(async ({ input: id }) => {
        try {
          const experience = await experienceController.getById(id);
          if (experience.isErr()) {
            return makeErrorResponse(experience.unwrapErr().toJson());
          }
          return makeSuccessResponse(experience.unwrap());
        } catch (error: unknown) {
          console.log("Experience controller failed to handle request");
          return error;
        }
      }),
  });
  return experienceRouter;
}
