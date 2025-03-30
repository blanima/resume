import { UseCase } from "@resume/core/src";
import { EducationEntity } from "../entities/education";
import { type EducationInteractor } from "../interactors/education";
import { AppError, Result } from "@resume/core/src";

export type EducationGetManyUseCase = UseCase<void, EducationEntity[]>;

export function EducationGetManyUseCaseFactory(
  interactor: EducationInteractor
): EducationGetManyUseCase {
  async function execute(): Promise<Result<EducationEntity[], AppError>> {
    return interactor.getManyEducations();
  }
  return { execute };
}
