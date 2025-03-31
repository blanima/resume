import { makeErrorResponse, makeSuccessResponse } from "@resume/core/src";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { type ExperienceController } from "../../application/presenters/controller/experience";
import { Experience } from "../../application/domain/entities/experience";
import { logger } from "../../utils/logger";
// import { LanguageCodes } from "../../application/domain/enum";

// TODO: replace once working with frontend instead of trpc panel
// const EXPERIENCE_TRANSLATIONS_SCHEMA = z.record(
//   z.enum([Object.values(LanguageCodes)]),
//   z.object({
//     title: z.string().nonempty(),
//     description: z.string().nonempty(),
//   })
// );

const EXPERIENCE_SCHEMA_NO_ID = z.object({
  translations: z.object({
    de: z
      .object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
      })
      .optional(),
    en: z
      .object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
      })
      .optional(),
  }),
  company_name: z.string().nonempty(),
  start_date: z.string(),
  end_date: z.string().optional(),
}) satisfies z.ZodType<Omit<Experience, "id" | "created_at" | "updated_at">>;

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
          logger.error(error, "Experience controller failed to handle request");
          return error;
        }
      }),
    getMany: publicProcedure
      .meta({ description: "Gets all experiences" })
      .query(async () => {
        try {
          const experiences = await experienceController.getMany();
          if (experiences.isErr()) {
            return makeErrorResponse(experiences.unwrapErr().toJson());
          }
          return makeSuccessResponse(experiences.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Experience controller failed to handle request");
          return error;
        }
      }),
    add: publicProcedure
      .meta({ description: "Adds an experience" })
      .input(EXPERIENCE_SCHEMA_NO_ID)
      .mutation(async ({ input: experience }) => {
        try {
          const addedExperience = await experienceController.add(experience);
          if (addedExperience.isErr()) {
            return makeErrorResponse(addedExperience.unwrapErr().toJson());
          }
          return makeSuccessResponse(addedExperience.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Experience controller failed to handle request");
          return error;
        }
      }),
    update: publicProcedure
      .meta({ description: "Updates an experience" })
      .input(
        z.object({
          id: z.string().nonempty().uuid(),
          ...EXPERIENCE_SCHEMA_NO_ID.shape,
        })
      )
      .mutation(async ({ input: experience }) => {
        try {
          const updatedExperience = await experienceController.update(
            experience
          );
          if (updatedExperience.isErr()) {
            return makeErrorResponse(updatedExperience.unwrapErr().toJson());
          }
          return makeSuccessResponse(updatedExperience.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Experience controller failed to handle request");
          return error;
        }
      }),
    delete: publicProcedure
      .meta({ description: "Deletes an experience" })
      .input(z.string().nonempty().uuid())
      .mutation(async ({ input: id }) => {
        try {
          const result = await experienceController.deleteExperience(id);
          if (result.isErr()) {
            return makeErrorResponse(result.unwrapErr().toJson());
          }
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Experience controller failed to handle request");
          return error;
        }
      }),
  });
  return experienceRouter;
}
