import { makeErrorResponse, makeSuccessResponse } from "@resume/core/src";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { logger } from "../../utils/logger";
import { type SkillController } from "../../application/presenters/controller/skill";

const SKILL_SCHEMA_NO_ID = z.object({
  translations: z.object({
    de: z
      .object({
        title: z.string().nonempty(),
      })
      .optional(),
    en: z
      .object({
        title: z.string().nonempty(),
      })
      .optional(),
  }),
  level: z.number(),
}) satisfies z.ZodType<Omit<Parameters<SkillController["add"]>[0], never>>;

const UUID_SCHEMA = z.string().nonempty().uuid();

export function initSkillRouter(skillController: SkillController) {
  const skillRouter = router({
    get: publicProcedure
      .meta({ description: "Gets a skill by id" })
      .input(UUID_SCHEMA)
      .query(async ({ input: id }) => {
        try {
          const skill = await skillController.getById(id);
          if (skill.isErr()) {
            return makeErrorResponse(skill.unwrapErr().toJson());
          }
          return makeSuccessResponse(skill.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    getMany: publicProcedure
      .meta({ description: "Gets all skills" })
      .query(async () => {
        try {
          const skills = await skillController.getMany();
          if (skills.isErr()) {
            return makeErrorResponse(skills.unwrapErr().toJson());
          }
          return makeSuccessResponse(skills.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    add: publicProcedure
      .meta({ description: "Adds a skill" })
      .input(SKILL_SCHEMA_NO_ID)
      .mutation(async ({ input: skill }) => {
        try {
          const addedSkill = await skillController.add(skill);
          if (addedSkill.isErr()) {
            return makeErrorResponse(addedSkill.unwrapErr().toJson());
          }
          return makeSuccessResponse(addedSkill.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    update: publicProcedure
      .meta({ description: "Updates a skill" })
      .input(
        z.object({
          id: UUID_SCHEMA,
          ...SKILL_SCHEMA_NO_ID.shape,
        })
      )
      .mutation(async ({ input: skill }) => {
        try {
          const updatedSkill = await skillController.update(skill);
          if (updatedSkill.isErr()) {
            return makeErrorResponse(updatedSkill.unwrapErr().toJson());
          }
          return makeSuccessResponse(updatedSkill.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    delete: publicProcedure
      .meta({ description: "Deletes a skill" })
      .input(UUID_SCHEMA)
      .mutation(async ({ input: id }) => {
        try {
          const result = await skillController.deleteSkill(id);
          if (result.isErr()) {
            return makeErrorResponse(result.unwrapErr().toJson());
          }
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    linkToExperience: publicProcedure
      .meta({ description: "Links a skill to an experience" })
      .input(
        z.object({
          skillId: UUID_SCHEMA,
          experienceId: UUID_SCHEMA,
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await skillController.linkToExperience(
            input.skillId,
            input.experienceId
          );
          if (result.isErr()) {
            return makeErrorResponse(result.unwrapErr().toJson());
          }
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    linkToEducation: publicProcedure
      .meta({ description: "Links a skill to an education" })
      .input(
        z.object({
          skillId: UUID_SCHEMA,
          educationId: UUID_SCHEMA,
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await skillController.linkToEducation(
            input.skillId,
            input.educationId
          );
          if (result.isErr()) {
            return makeErrorResponse(result.unwrapErr().toJson());
          }
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    unlinkFromExperience: publicProcedure
      .meta({ description: "Unlinks a skill from an experience" })
      .input(
        z.object({
          skillId: UUID_SCHEMA,
          experienceId: UUID_SCHEMA,
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await skillController.unlinkFromExperience(
            input.skillId,
            input.experienceId
          );
          if (result.isErr()) {
            return makeErrorResponse(result.unwrapErr().toJson());
          }
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    unlinkFromEducation: publicProcedure
      .meta({ description: "Unlinks a skill from an education" })
      .input(
        z.object({
          skillId: UUID_SCHEMA,
          educationId: UUID_SCHEMA,
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await skillController.unlinkFromEducation(
            input.skillId,
            input.educationId
          );
          if (result.isErr()) {
            return makeErrorResponse(result.unwrapErr().toJson());
          }
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    getLinkedEducations: publicProcedure
      .meta({ description: "Gets linked educations for a skill" })
      .input(UUID_SCHEMA)
      .query(async ({ input: skillId }) => {
        try {
          const result = await skillController.getLinkedEducations(skillId);
          if (result.isErr())
            return makeErrorResponse(result.unwrapErr().toJson());
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    getLinkedExperiences: publicProcedure
      .meta({ description: "Gets linked experiences for a skill" })
      .input(UUID_SCHEMA)
      .query(async ({ input: skillId }) => {
        try {
          const result = await skillController.getLinkedExperiences(skillId);
          if (result.isErr())
            return makeErrorResponse(result.unwrapErr().toJson());
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    getLinkedSkillsByExperienceId: publicProcedure
      .meta({ description: "Gets skills linked to an experience" })
      .input(UUID_SCHEMA)
      .query(async ({ input: experienceId }) => {
        try {
          const result = await skillController.getLinkedSkillsByExperienceId(
            experienceId
          );
          if (result.isErr())
            return makeErrorResponse(result.unwrapErr().toJson());
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
    getLinkedSkillsByEducationId: publicProcedure
      .meta({ description: "Gets skills linked to an education" })
      .input(UUID_SCHEMA)
      .query(async ({ input: educationId }) => {
        try {
          const result = await skillController.getLinkedSkillsByEducationId(
            educationId
          );
          if (result.isErr())
            return makeErrorResponse(result.unwrapErr().toJson());
          return makeSuccessResponse(result.unwrap());
        } catch (error: unknown) {
          logger.error(error, "Skill controller failed to handle request");
          return error;
        }
      }),
  });
  return skillRouter;
}
