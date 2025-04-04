import {
  Skill,
  SkillEducationLink,
  SkillEntity,
  SkillExperienceLink,
} from "../domain/entities/skill";
import { type Transaction } from "./types";
import { Ok, Err, Result, type AppError, createAppErr } from "@resume/core/src";
import { Clients } from "./clients";
import { ErrorType } from "../domain/error";

export interface SkillGateway {
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  exists(id: string, trx: Transaction): Promise<Result<boolean, AppError>>;
  getSkillById(
    id: string,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>>;
  getManySkills(trx: Transaction): Promise<Result<SkillEntity[], AppError>>;
  addSkill(
    skill: Omit<Skill, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>>;
  updateSkill(
    id: string,
    skill: Partial<Skill>,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>>;
  deleteSkill(
    id: string,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>>;
  linkSkillToExperience(
    skillId: string,
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink, AppError>>;
  unlinkSkillFromExperience(
    skillId: string,
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink, AppError>>;
  linkSkillToEducation(
    skillId: string,
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink, AppError>>;
  unlinkSkillFromEducation(
    skillId: string,
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink, AppError>>;
  getLinkedExperiences(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>>;
  getLinkedEducations(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>>;
  getLinkedSkillsByExperienceId(
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>>;
  getLinkedSkillsByEducationId(
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>>;
}

const TBL_SKILLS = "skills";

export function SkillGatewayFactory(clients: Clients): SkillGateway {
  const client = clients.getDbClient();

  async function beginTrx(): Promise<Transaction> {
    return await client.transaction();
  }

  async function commitTrx(trx: Transaction): Promise<void> {
    await trx.commit();
  }

  async function rollbackTrx(trx: Transaction): Promise<void> {
    await trx.rollback();
  }

  async function exists(
    id: string,
    trx: Transaction
  ): Promise<Result<boolean, AppError>> {
    try {
      const found = await client
        .select()
        .from(TBL_SKILLS)
        .where({ id })
        .transacting(trx)
        .first();
      return Ok(!!found);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to check if skill exists",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function getSkillById(
    id: string,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    try {
      const found: any = await client
        .select()
        .from(TBL_SKILLS)
        .where({ id })
        .transacting(trx)
        .first();

      if (!found) {
        return Err(
          createAppErr({
            message: `Skill with id ${id} not found`,
            type: ErrorType.SKILL_NOT_FOUND,
          })
        );
      }

      return Ok(SkillEntity.create(found));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to get skill with id ${id}`,
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function getManySkills(
    trx: Transaction
  ): Promise<Result<SkillEntity[], AppError>> {
    try {
      const skills = await client
        .select<Skill[]>()
        .from(TBL_SKILLS)
        .transacting(trx);
      return Ok(skills.map((skill) => SkillEntity.create(skill)));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ?? "Failed to get skills",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function addSkill(
    skill: Omit<Skill, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    try {
      const now = new Date().toISOString();
      const skillEntry = {
        ...skill,
        created_at: now,
      };
      const added = await client(TBL_SKILLS)
        .insert(skillEntry)
        .transacting(trx)
        .returning<Skill[]>("*")
        .then((rows) => rows[0]);

      if (!added) {
        return Err(
          createAppErr({
            message: "Failed to add skill",
            type: ErrorType.PERSISTENCE,
            ctx: { skillEntry },
          })
        );
      }

      return Ok(SkillEntity.create(added));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ?? "Failed to add skill",
          type: ErrorType.PERSISTENCE,
          ctx: { skill },
        })
      );
    }
  }

  async function updateSkill(
    id: string,
    skill: Partial<Skill>,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    try {
      const now = new Date().toISOString();
      const updatedSkill = {
        ...skill,
        updated_at: now,
      };

      const updatedRawSkill = await client(TBL_SKILLS)
        .where({ id })
        .update(updatedSkill)
        .transacting(trx)
        .returning<Skill[]>("*")
        .then((rows) => rows[0]);

      if (!updatedRawSkill) {
        return Err(
          createAppErr({
            message: `Skill with id ${id} not found`,
            type: ErrorType.SKILL_NOT_FOUND,
            ctx: { id, skill },
          })
        );
      }

      return Ok(SkillEntity.create(updatedRawSkill));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to update skill with id ${id}`,
          type: ErrorType.PERSISTENCE,
          ctx: { id, skill },
        })
      );
    }
  }

  async function deleteSkill(
    id: string,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    try {
      const deletedEntry = await client(TBL_SKILLS)
        .where({ id })
        .delete()
        .transacting(trx)
        .returning<Skill[]>("*")
        .then((rows) => rows[0]);

      if (!deletedEntry) {
        return Err(
          createAppErr({
            message: `Skill with id ${id} not found`,
            type: ErrorType.SKILL_NOT_FOUND,
            ctx: { id },
          })
        );
      }

      return Ok(SkillEntity.create(deletedEntry));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to delete skill with id ${id}`,
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function linkSkillToExperience(
    skillId: string,
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink, AppError>> {
    try {
      const skillExperienceLink = await client("skills_experiences")
        .insert({
          skill_id: skillId,
          experience_id: experienceId,
        })
        .transacting(trx)
        .returning<SkillExperienceLink[]>("*")
        .then((rows) => rows[0]);

      if (!skillExperienceLink) {
        return Err(
          createAppErr({
            message: "Failed to link skill to experience",
            type: ErrorType.PERSISTENCE,
            ctx: { skillId, experienceId },
          })
        );
      }

      return Ok(skillExperienceLink);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to link skill to experience",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId, experienceId },
        })
      );
    }
  }

  async function unlinkSkillFromExperience(
    skillId: string,
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink, AppError>> {
    try {
      const deletedSkillExperienceLink = await client("skills_experiences")
        .where({ skill_id: skillId, experience_id: experienceId })
        .delete()
        .transacting(trx)
        .returning<SkillExperienceLink[]>("*")
        .then((rows) => rows[0]);

      if (!deletedSkillExperienceLink) {
        return Err(
          createAppErr({
            message: "Skill-link not found",
            type: ErrorType.SKILL_LINK_NOT_FOUND,
            ctx: { skillId, experienceId, kind: "experience" },
          })
        );
      }

      return Ok(deletedSkillExperienceLink);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to unlink skill from experience",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId, experienceId },
        })
      );
    }
  }

  async function linkSkillToEducation(
    skillId: string,
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink, AppError>> {
    try {
      const skillEducationLink = await client("skills_educations")
        .insert({ skill_id: skillId, education_id: educationId })
        .transacting(trx)
        .returning<SkillEducationLink[]>("*")
        .then((rows) => rows[0]);

      if (!skillEducationLink) {
        return Err(
          createAppErr({
            message: "Failed to link skill to education",
            type: ErrorType.PERSISTENCE,
            ctx: { skillId, educationId },
          })
        );
      }

      return Ok(skillEducationLink);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to link skill to education",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId, educationId },
        })
      );
    }
  }

  async function unlinkSkillFromEducation(
    skillId: string,
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink, AppError>> {
    try {
      const removedSkillEducationLink = await client("skills_educations")
        .where({ skill_id: skillId, education_id: educationId })
        .delete()
        .transacting(trx)
        .returning("*")
        .then((rows) => rows[0]);

      if (!removedSkillEducationLink) {
        return Err(
          createAppErr({
            message: "Skill-link not found",
            type: ErrorType.SKILL_LINK_NOT_FOUND,
            ctx: { skillId, educationId, kind: "education" },
          })
        );
      }

      return Ok(removedSkillEducationLink);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to unlink skill from education",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId, educationId },
        })
      );
    }
  }

  async function getLinkedEducations(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>> {
    try {
      const links = await client
        .select()
        .from("skills_educations")
        .where({ skill_id: skillId })
        .transacting(trx);
      return Ok(links);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error)?.message ?? "Failed to get linked educations",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId },
        })
      );
    }
  }

  async function getLinkedExperiences(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>> {
    try {
      const links = await client
        .select()
        .from("skills_experiences")
        .where({ skill_id: skillId })
        .transacting(trx);

      return Ok(links);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error)?.message ?? "Failed to get linked experiences",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId },
        })
      );
    }
  }

  async function getLinkedSkillsByExperienceId(
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>> {
    try {
      const links = await client
        .select()
        .from("skills_experiences")
        .where({ experience_id: experienceId })
        .transacting(trx);
      return Ok(links);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error)?.message ??
            "Failed to get linked skills by experience id",
          type: ErrorType.PERSISTENCE,
          ctx: { experienceId },
        })
      );
    }
  }

  async function getLinkedSkillsByEducationId(
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>> {
    try {
      const links = await client
        .select()
        .from("skills_educations")
        .where({ education_id: educationId })
        .transacting(trx);
      return Ok(links);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error)?.message ??
            "Failed to get linked skills by education id",
          type: ErrorType.PERSISTENCE,
          ctx: { educationId },
        })
      );
    }
  }

  return {
    beginTrx,
    commitTrx,
    rollbackTrx,
    exists,
    getSkillById,
    getManySkills,
    addSkill,
    updateSkill,
    deleteSkill,
    linkSkillToExperience,
    unlinkSkillFromExperience,
    linkSkillToEducation,
    unlinkSkillFromEducation,
    getLinkedEducations,
    getLinkedExperiences,
    getLinkedSkillsByExperienceId,
    getLinkedSkillsByEducationId,
  };
}
