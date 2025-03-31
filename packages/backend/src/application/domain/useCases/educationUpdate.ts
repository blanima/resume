import { createAppErr, Err, UseCase } from "@resume/core/src";
import { type Education, EducationEntity } from "../entities/education";
import { type EducationInteractor } from "../interactors/education";
import { AppError, Result } from "@resume/core/src";
import { Transaction } from "../../data/types";
import { ErrorType } from "../error";

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
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();
      const result = await interactor.updateEducation(
        education.id,
        education,
        trx
      );
      if (result.isErr()) {
        await interactor.rollbackTrx(trx);
        return result;
      }
      await interactor.commitTrx(trx);
      return result;
    } catch (error) {
      if (trx) await interactor.rollbackTrx(trx);
      if (typeof (error as AppError).type === "string") {
        return Err(error as AppError);
      } else {
        return Err(
          createAppErr({
            message: (error as Error).message ?? "Failed to update education",
            type: ErrorType.PERSISTENCE,
          })
        );
      }
    }
  }
  return { execute };
}
