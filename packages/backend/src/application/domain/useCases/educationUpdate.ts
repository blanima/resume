import { UseCase } from "@resume/core/src";
import { type Education, EducationEntity } from "../entities/education";
import { type EducationInteractor } from "../interactors/education";
import { AppError, Result } from "@resume/core/src";

export type EducationUpdateUseCase = UseCase<
  Partial<Education> & { id: string },
  EducationEntity
>;

export function EducationUpdateUseCaseFactory(
  interactor: EducationInteractor
): EducationUpdateUseCase {
  async function execute(
    education: Partial<Education> & { id: string }
  ): Promise<Result<EducationEntity, AppError>> {
    return interactor.updateEducation(education.id, education);
  }
  return { execute };
}
