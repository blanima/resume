import { UseCase } from "@resume/core/src";
import { Experience, ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";

export type ExperienceUpdateUseCase = UseCase<
  Partial<Experience> & { id: string },
  ExperienceEntity
>;

export function ExperienceUpdateUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceUpdateUseCase {
  async function execute(
    experience: Partial<Experience> & { id: string }
  ): Promise<Result<ExperienceEntity, AppError>> {
    return interactor.updateExperience(experience.id, experience);
  }
  return { execute };
}
