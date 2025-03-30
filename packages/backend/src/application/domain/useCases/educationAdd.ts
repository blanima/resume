import { UseCase } from "@resume/core/src";
import { type Education, EducationEntity } from "../entities/education";
import { type EducationInteractor } from "../interactors/education";
import { AppError, Result } from "@resume/core/src";

export type EducationAddUseCase = UseCase<
  Omit<Education, "id" | "created_at" | "updated_at">,
  EducationEntity
>;

export function EducationAddUseCaseFactory(
  interactor: EducationInteractor
): EducationAddUseCase {
  async function execute(
    education: Omit<Education, "id" | "created_at" | "updated_at">
  ): Promise<Result<EducationEntity, AppError>> {
    return interactor.addEducation(education);
  }
  return { execute };
}
