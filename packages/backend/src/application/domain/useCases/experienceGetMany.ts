import { UseCase } from "@resume/core/src";
import { ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";

export type ExperienceGetManyUseCase = UseCase<void, ExperienceEntity[]>;

export function ExperienceGetManyUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceGetManyUseCase {
  async function execute(): Promise<Result<ExperienceEntity[], AppError>> {
    return interactor.getManyExperiences();
  }
  return { execute };
}
