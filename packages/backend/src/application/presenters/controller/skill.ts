import { SkillGetByIdUseCase } from "../../domain/useCases/skillGetById";
import { SkillAddUseCase } from "../../domain/useCases/skillAdd";
import { SkillGetManyUseCase } from "../../domain/useCases/skillGetMany";
import { SkillUpdateUseCase } from "../../domain/useCases/skillUpdate";
import { SkillDeleteUseCase } from "../../domain/useCases/skillDelete";
import {
  SkillEducationLink,
  SkillExperienceLink,
  type Skill,
} from "../../domain/entities/skill";
import { AppError, Ok, Result } from "@resume/core/src";
import { SkillLinkEducationUseCase } from "src/application/domain/useCases/skillLinkEducation";
import { SkillLinkExperienceUseCase } from "src/application/domain/useCases/skillLinkExperience";
import { SkillUnlinkExperienceUseCase } from "src/application/domain/useCases/skillUnlinkExperience";
import { SkillUnlinkEducationUseCase } from "src/application/domain/useCases/skillUnlinkEducation";
import { SkillGetLinkedEducationsUseCase } from "../../domain/useCases/skillGetLinkedEducations";
import { SkillGetLinkedExperiencesUseCase } from "../../domain/useCases/skillGetLinkedExperiences";
import { SkillGetLinkedSkillsByExperienceIdUseCase } from "../../domain/useCases/skillGetLinkedSkillsByExperienceId";
import { SkillGetLinkedSkillsByEducationIdUseCase } from "../../domain/useCases/skillGetLinkedSkillsByEducationId";

export interface SkillController {
  getById: (id: string) => Promise<Result<Skill, AppError>>;
  getMany: () => Promise<Result<Skill[], AppError>>;
  add: (
    skill: Omit<Skill, "id" | "created_at" | "updated_at">
  ) => Promise<Result<Skill, AppError>>;
  update: (
    skill: Partial<Skill> & { id: string }
  ) => Promise<Result<Skill, AppError>>;
  deleteSkill: (id: string) => Promise<Result<Skill, AppError>>;
  linkToExperience: (
    skillId: string,
    experienceId: string
  ) => Promise<Result<SkillExperienceLink, AppError>>;
  linkToEducation: (
    skillId: string,
    educationId: string
  ) => Promise<Result<SkillEducationLink, AppError>>;
  unlinkFromExperience: (
    skillId: string,
    experienceId: string
  ) => Promise<Result<SkillExperienceLink, AppError>>;
  unlinkFromEducation: (
    skillId: string,
    educationId: string
  ) => Promise<Result<SkillEducationLink, AppError>>;
  getLinkedEducations: (
    skillId: string
  ) => Promise<Result<SkillEducationLink[], AppError>>;
  getLinkedExperiences: (
    skillId: string
  ) => Promise<Result<SkillExperienceLink[], AppError>>;
  getLinkedSkillsByExperienceId: (
    experienceId: string
  ) => Promise<Result<SkillExperienceLink[], AppError>>;
  getLinkedSkillsByEducationId: (
    educationId: string
  ) => Promise<Result<SkillEducationLink[], AppError>>;
}

export interface SkillControllerDependencies {
  useCases: {
    getById: SkillGetByIdUseCase;
    add: SkillAddUseCase;
    getMany: SkillGetManyUseCase;
    update: SkillUpdateUseCase;
    deleteSkill: SkillDeleteUseCase;
    linkToExperience: SkillLinkExperienceUseCase;
    linkToEducation: SkillLinkEducationUseCase;
    unlinkFromExperience: SkillUnlinkExperienceUseCase;
    unlinkFromEducation: SkillUnlinkEducationUseCase;
    getLinkedEducations: SkillGetLinkedEducationsUseCase;
    getLinkedExperiences: SkillGetLinkedExperiencesUseCase;
    getLinkedSkillsByExperienceId: SkillGetLinkedSkillsByExperienceIdUseCase;
    getLinkedSkillsByEducationId: SkillGetLinkedSkillsByEducationIdUseCase;
  };
}

export function SkillControllerFactory({
  useCases: {
    getById,
    add,
    getMany,
    update,
    deleteSkill,
    linkToExperience,
    linkToEducation,
    unlinkFromExperience,
    unlinkFromEducation,
    getLinkedEducations,
    getLinkedExperiences,
    getLinkedSkillsByExperienceId,
    getLinkedSkillsByEducationId,
  },
}: SkillControllerDependencies): SkillController {
  return {
    getById: async (id: string) => {
      const result = await getById.execute(id);
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap().props);
    },
    getMany: async () => {
      const result = await getMany.execute();
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap().map((skill) => skill.props));
    },
    add: async (skill: Omit<Skill, "id" | "created_at" | "updated_at">) => {
      const result = await add.execute(skill);
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap().props);
    },
    update: async (changes: Partial<Skill> & { id: string }) => {
      const result = await update.execute({ changes, id: changes.id });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap().props);
    },
    deleteSkill: async (id: string) => {
      const result = await deleteSkill.execute(id);
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap().props);
    },
    linkToExperience: async (skillId: string, experienceId: string) => {
      const result = await linkToExperience.execute({
        skillId,
        experienceId,
      });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
    linkToEducation: async (skillId: string, educationId: string) => {
      const result = await linkToEducation.execute({
        skillId,
        educationId,
      });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
    unlinkFromExperience: async (skillId: string, experienceId: string) => {
      const result = await unlinkFromExperience.execute({
        skillId,
        experienceId,
      });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
    unlinkFromEducation: async (skillId: string, educationId: string) => {
      const result = await unlinkFromEducation.execute({
        skillId,
        educationId,
      });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
    getLinkedEducations: async (skillId: string) => {
      const result = await getLinkedEducations.execute({ skillId });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
    getLinkedExperiences: async (skillId: string) => {
      const result = await getLinkedExperiences.execute({ skillId });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
    getLinkedSkillsByExperienceId: async (experienceId: string) => {
      const result = await getLinkedSkillsByExperienceId.execute({
        experienceId,
      });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
    getLinkedSkillsByEducationId: async (educationId: string) => {
      const result = await getLinkedSkillsByEducationId.execute({
        educationId,
      });
      if (result.isErr()) return result as Result<never, AppError>;
      return Ok(result.unwrap());
    },
  };
}
