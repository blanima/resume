import { UseCase } from "@resume/core/src";
import { ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";

export type ExperienceDeleteUseCase = UseCase<string, ExperienceEntity>;

export function ExperienceDeleteUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceDeleteUseCase {
  async function execute(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    return interactor.deleteExperience(id);
  }
  return { execute };
}
