import { UseCase } from "@resume/core/src";
import { ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";

export type GetExperienceByIdUseCase = UseCase<string, ExperienceEntity>;

export function GetExperienceByIdUseCaseFactory(
  interactor: ExperienceInteractor
): GetExperienceByIdUseCase {
  async function execute(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    return interactor.getExperienceById(id);
  }
  return { execute };
}
