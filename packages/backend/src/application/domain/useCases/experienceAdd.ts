import { UseCase } from "@resume/core/src";
import { type Experience, ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";

export type ExperienceAddUseCase = UseCase<
  Omit<Experience, "id" | "created_at" | "updated_at">,
  ExperienceEntity
>;

export function ExperienceAddUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceAddUseCase {
  async function execute(
    experience: Omit<Experience, "id" | "created_at" | "updated_at">
  ): Promise<Result<ExperienceEntity, AppError>> {
    return interactor.addExperience(experience);
  }
  return { execute };
}
