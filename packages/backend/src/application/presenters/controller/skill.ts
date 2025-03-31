import { SkillGetByIdUseCase } from "../../domain/useCases/skillGetById";
import { SkillAddUseCase } from "../../domain/useCases/skillAdd";
import { SkillGetManyUseCase } from "../../domain/useCases/skillGetMany";
import { SkillUpdateUseCase } from "../../domain/useCases/skillUpdate";
import { SkillDeleteUseCase } from "../../domain/useCases/skillDelete";
import { type Skill } from "../../domain/entities/skill";
import { AppError, Ok, Result } from "@resume/core/src";

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
}

export interface SkillControllerDependencies {
  useCases: {
    getById: SkillGetByIdUseCase;
    add: SkillAddUseCase;
    getMany: SkillGetManyUseCase;
    update: SkillUpdateUseCase;
    deleteSkill: SkillDeleteUseCase;
  };
}

export function SkillControllerFactory({
  useCases: { getById, add, getMany, update, deleteSkill },
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
  };
}
