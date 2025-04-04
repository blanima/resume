import {
  Skill,
  SkillEntity,
  SkillExperienceLink,
  SkillEducationLink,
} from "../entities/skill";
import { SkillGateway } from "../../data/skillGateway";
import { Result, AppError } from "@resume/core/src";
import { type Transaction } from "../../data/types";

export interface SkillInteractor {
  // Transaction management
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  // Gateway operations
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
  exists(id: string, trx: Transaction): Promise<Result<boolean, AppError>>;
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
  getLinkedEducations(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>>;
  getLinkedExperiences(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>>;
  getLinkedSkillsByExperienceId(
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>>;
  getLinkedSkillsByEducationId(
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>>;
}

export function SkillInteractorFactory(gateway: SkillGateway): SkillInteractor {
  async function beginTrx(): Promise<Transaction> {
    return gateway.beginTrx();
  }

  async function commitTrx(trx: Transaction): Promise<void> {
    await gateway.commitTrx(trx);
  }

  async function rollbackTrx(trx: Transaction): Promise<void> {
    await gateway.rollbackTrx(trx);
  }

  async function getSkillById(
    id: string,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    return gateway.getSkillById(id, trx);
  }

  async function getManySkills(
    trx: Transaction
  ): Promise<Result<SkillEntity[], AppError>> {
    return gateway.getManySkills(trx);
  }

  async function addSkill(
    skill: Omit<Skill, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    return gateway.addSkill(skill, trx);
  }

  async function updateSkill(
    id: string,
    skill: Partial<Skill>,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    return gateway.updateSkill(id, skill, trx);
  }

  async function deleteSkill(
    id: string,
    trx: Transaction
  ): Promise<Result<SkillEntity, AppError>> {
    return gateway.deleteSkill(id, trx);
  }

  async function exists(
    id: string,
    trx: Transaction
  ): Promise<Result<boolean, AppError>> {
    return gateway.exists(id, trx);
  }

  async function linkSkillToExperience(
    skillId: string,
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink, AppError>> {
    return gateway.linkSkillToExperience(skillId, experienceId, trx);
  }

  async function unlinkSkillFromExperience(
    skillId: string,
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink, AppError>> {
    return gateway.unlinkSkillFromExperience(skillId, experienceId, trx);
  }

  async function linkSkillToEducation(
    skillId: string,
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink, AppError>> {
    return gateway.linkSkillToEducation(skillId, educationId, trx);
  }

  async function unlinkSkillFromEducation(
    skillId: string,
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink, AppError>> {
    return gateway.unlinkSkillFromEducation(skillId, educationId, trx);
  }

  async function getLinkedEducations(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>> {
    return gateway.getLinkedEducations(skillId, trx);
  }

  async function getLinkedExperiences(
    skillId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>> {
    return gateway.getLinkedExperiences(skillId, trx);
  }

  async function getLinkedSkillsByExperienceId(
    experienceId: string,
    trx: Transaction
  ): Promise<Result<SkillExperienceLink[], AppError>> {
    return gateway.getLinkedSkillsByExperienceId(experienceId, trx);
  }

  async function getLinkedSkillsByEducationId(
    educationId: string,
    trx: Transaction
  ): Promise<Result<SkillEducationLink[], AppError>> {
    return gateway.getLinkedSkillsByEducationId(educationId, trx);
  }

  return {
    beginTrx,
    commitTrx,
    rollbackTrx,
    getSkillById,
    getManySkills,
    addSkill,
    updateSkill,
    deleteSkill,
    exists,
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
