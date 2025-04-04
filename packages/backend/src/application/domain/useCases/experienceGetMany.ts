import { createAppErr, Err, UseCase } from "@resume/core/src";
import { ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";
import { Transaction } from "../../data/types";
import { ErrorType } from "../error";

export type ExperienceGetManyUseCase = UseCase<void, ExperienceEntity[]>;

export function ExperienceGetManyUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceGetManyUseCase {
  async function execute(): Promise<Result<ExperienceEntity[], AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();
      const result = await interactor.getManyExperiences(trx);
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
              (error as Error).message || "Failed to get many experiences",
            type: ErrorType.PERSISTENCE,
            ctx: { originalError: error },
          })
        );
      }
    }
  }
  return { execute };
}
