import { GetExperienceByIdUseCase } from "../../domain/useCases/experienceGetById";
import { Experience } from "src/application/domain/entities/experience";
import { AppError, Ok, Result } from "@resume/core/src";

export interface ExperienceController {
  getById: (id: string) => Promise<Result<Experience, AppError>>;
}

export interface ExperienceControllerDependencies {
  useCases: {
    getById: GetExperienceByIdUseCase;
  };
}

export function ExperienceControllerFactory({
  useCases: { getById },
}: ExperienceControllerDependencies) {
  return {
    getById: async (id: string) => {
      const result = await getById.execute(id);
      if (result.isErr() === true) {
        return result as Result<never, AppError>;
      }
      return Ok(result.unwrap().props);
    },
  };
}
