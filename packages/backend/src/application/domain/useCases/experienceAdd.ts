import { createAppErr, Err, UseCase } from "@resume/core/src";
import { type Experience, ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";
import { Transaction } from "../../data/types";
import { ErrorType } from "../error";

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
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();
      const result = await interactor.addExperience(experience, trx);
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
            message: (error as Error).message ?? "Failed to add experience",
            type: ErrorType.PERSISTENCE,
          })
        );
      }
    }
  }
  return { execute };
}
