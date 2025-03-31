import { createAppErr, Err, UseCase } from "@resume/core/src";
import { ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";
import { Transaction } from "../../data/types";
import { ErrorType } from "../error";

export type ExperienceGetByIdUseCase = UseCase<string, ExperienceEntity>;

export function ExperienceGetByIdUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceGetByIdUseCase {
  async function execute(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();
      const result = await interactor.getExperienceById(id, trx);
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
            message:
              (error as Error).message ?? "Failed to get experience by id",
            type: ErrorType.PERSISTENCE,
          })
        );
      }
    }
  }
  return { execute };
}
