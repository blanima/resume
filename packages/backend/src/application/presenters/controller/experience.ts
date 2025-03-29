import { ExperienceGetByIdUseCase } from "../../domain/useCases/experienceGetById";
import { type Experience } from "../../domain/entities/experience";
import { AppError, Ok, Result } from "@resume/core/src";
import { type ExperienceAddUseCase } from "../../domain/useCases/experienceAdd";
import { type ExperienceGetManyUseCase } from "src/application/domain/useCases/experienceGetMany";
import { type ExperienceUpdateUseCase } from "src/application/domain/useCases/experienceUpdate";
import { ExperienceDeleteUseCase } from "src/application/domain/useCases/experienceDelete";

export interface ExperienceController {
  getById: (id: string) => Promise<Result<Experience, AppError>>;
  getMany: () => Promise<Result<Experience[], AppError>>;
  add: (
    experience: Omit<Experience, "id" | "created_at" | "updated_at">
  ) => Promise<Result<Experience, AppError>>;
  update: (
    experience: Partial<Experience> & { id: string }
  ) => Promise<Result<Experience, AppError>>;
  deleteExperience: (id: string) => Promise<Result<Experience, AppError>>;
}

export interface ExperienceControllerDependencies {
  useCases: {
    getById: ExperienceGetByIdUseCase;
    add: ExperienceAddUseCase;
    getMany: ExperienceGetManyUseCase;
    update: ExperienceUpdateUseCase;
    deleteExperience: ExperienceDeleteUseCase;
  };
}

export function ExperienceControllerFactory({
  useCases: { getById, add, getMany, update, deleteExperience },
}: ExperienceControllerDependencies) {
  return {
    getById: async (id: string) => {
      const result = await getById.execute(id);
      if (result.isErr() === true) {
        return result as Result<never, AppError>;
      }
      return Ok(result.unwrap().props);
    },
    getMany: async () => {
      const result = await getMany.execute();
      if (result.isErr() === true) {
        return result as Result<never, AppError>;
      }
      return Ok(result.unwrap().map((exp) => exp.props));
    },
    add: async (
      experience: Omit<Experience, "id" | "created_at" | "updated_at">
    ) => {
      const result = await add.execute(experience);
      if (result.isErr() === true) {
        return result as Result<never, AppError>;
      }
      return Ok(result.unwrap().props);
    },
    update: async (experience: Partial<Experience> & { id: string }) => {
      const result = await update.execute(experience);
      if (result.isErr() === true) {
        return result as Result<never, AppError>;
      }
      const updatedExperience = { ...result.unwrap().props };
      const updateResult = await add.execute(updatedExperience);
      if (updateResult.isErr() === true) {
        return updateResult as Result<never, AppError>;
      }
      return Ok(updateResult.unwrap().props);
    },
    deleteExperience: async (id: string) => {
      const result = await deleteExperience.execute(id);
      if (result.isErr() === true) {
        return result as Result<never, AppError>;
      }
      return Ok(result.unwrap().props);
    },
  };
}
