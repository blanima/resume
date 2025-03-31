import { createAppErr, UseCase } from "@resume/core/src";
import { type Education, EducationEntity } from "../entities/education";
import { type EducationInteractor } from "../interactors/education";
import { AppError, Result, Err } from "@resume/core/src";
import { ErrorType } from "../error";
import { Transaction } from "../../data/types";

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
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();
      const result = await interactor.addEducation(education, trx);
      if (result.isErr()) {
        await interactor.rollbackTrx(trx);
        return result;
      }
      await interactor.commitTrx(trx);
      return result;
    } catch (error) {
      if (trx) {
        await interactor.rollbackTrx(trx);
      }
      if (typeof (error as AppError).type === "string") {
        return Err(error as AppError);
      } else {
        return Err(
          createAppErr({
            message: (error as Error).message ?? "Failed to add education",
            type: ErrorType.PERSISTENCE,
          })
        );
      }
    }
  }
  return { execute };
}
