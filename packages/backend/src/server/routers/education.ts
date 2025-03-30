import { makeErrorResponse, makeSuccessResponse } from "@resume/core/src";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { type EducationController } from "../../application/presenters/controller/education";
import { logger } from "../../utils/logger";
import { Education } from "src/application/domain/entities/education";

// const EDUCATION_SCHEMA_NO_ID = z.object({
//   institution: z.string().nonempty(),
//   degree: z.string().optional(),
//   start_date: z.string(),
//   end_date: z.string().optional(),
//   translations: z.record(
//     z.object({
//       title: z.string().nonempty(),
//       description: z.string().nonempty(),
//     })
//   ),
// }) satisfies z.ZodType<Omit<Education, "id">>;

const EDUCATION_SCHEMA_NO_ID = z.object({
  institution: z.string().nonempty(),
  degree: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
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
}) as z.ZodType<Omit<Education, "id">>;

export function initEducationRouter(educationController: EducationController) {
  const educationRouter = router({
    get: publicProcedure
      .meta({ description: "Gets an education by id" })
      .input(z.string().nonempty().uuid())
      .query(async ({ input: id }) => {
        try {
          const education = await educationController.getById(id);

          if (education.isErr()) {
            return makeErrorResponse(education.unwrapErr().toJson());
          }

          return makeSuccessResponse(education.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Education controller failed to handle request");
          return error;
        }
      }),
    getMany: publicProcedure
      .meta({ description: "Gets all educations" })
      .query(async () => {
        try {
          const educations = await educationController.getMany();
          if (educations.isErr()) {
            return makeErrorResponse(educations.unwrapErr().toJson());
          }
          return makeSuccessResponse(educations.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Education controller failed to handle request");
          return error;
        }
      }),
    add: publicProcedure
      .meta({ description: "Adds an education" })
      .input(EDUCATION_SCHEMA_NO_ID)
      .mutation(async ({ input: education }) => {
        try {
          const addedEducation = await educationController.add(education);

          if (addedEducation.isErr()) {
            return makeErrorResponse(addedEducation.unwrapErr().toJson());
          }

          return makeSuccessResponse(addedEducation.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Education controller failed to handle request");
          return error;
        }
      }),
    update: publicProcedure
      .meta({ description: "Updates an education" })
      .input(
        z.object({
          id: z.string().nonempty().uuid(),
          institution: z.string().nonempty(),
          degree: z.string().optional(),
          start_date: z.string(),
          end_date: z.string().optional(),
          translations: z
            .record(
              z.object({
                title: z.string().nonempty(),
                description: z.string().nonempty(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input: education }) => {
        try {
          const updatedEducation = await educationController.update(education);

          if (updatedEducation.isErr()) {
            return makeErrorResponse(updatedEducation.unwrapErr().toJson());
          }

          return makeSuccessResponse(updatedEducation.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Education controller failed to handle request");
          return error;
        }
      }),
    delete: publicProcedure
      .meta({ description: "Deletes an education" })
      .input(z.string().nonempty().uuid())
      .mutation(async ({ input: id }) => {
        try {
          const result = await educationController.deleteEducation(id);

          if (result.isErr()) {
            return makeErrorResponse(result.unwrapErr().toJson());
          }

          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Education controller failed to handle request");
          return error;
        }
      }),
  });
  return educationRouter;
}
