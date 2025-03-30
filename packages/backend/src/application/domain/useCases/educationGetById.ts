import { UseCase } from "@resume/core/src";
import { EducationEntity } from "../entities/education";
import { type EducationInteractor } from "../interactors/education";
import { AppError, Result } from "@resume/core/src";

export type EducationGetByIdUseCase = UseCase<string, EducationEntity>;

export function EducationGetByIdUseCaseFactory(
  interactor: EducationInteractor
): EducationGetByIdUseCase {
  async function execute(
    id: string
  ): Promise<Result<EducationEntity, AppError>> {
    return interactor.getEducationById(id);
  }
  return { execute };
}
