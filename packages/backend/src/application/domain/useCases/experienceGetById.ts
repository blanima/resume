import { UseCase } from "@resume/core/src";
import { ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";

export type ExperienceGetByIdUseCase = UseCase<string, ExperienceEntity>;

export function ExperienceGetByIdUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceGetByIdUseCase {
  async function execute(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    return interactor.getExperienceById(id);
  }
  return { execute };
}
