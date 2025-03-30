import { UseCase } from "@resume/core/src";
import { EducationEntity } from "../entities/education";
import { type EducationInteractor } from "../interactors/education";
import { AppError, Result } from "@resume/core/src";

export type EducationDeleteUseCase = UseCase<string, EducationEntity>;

export function EducationDeleteUseCaseFactory(
  interactor: EducationInteractor
): EducationDeleteUseCase {
  async function execute(
    id: string
  ): Promise<Result<EducationEntity, AppError>> {
    return interactor.deleteEducation(id);
  }
  return { execute };
}
