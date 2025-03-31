import { createAppErr, Err, UseCase } from "@resume/core/src";
import { Experience, ExperienceEntity } from "../entities/experience";
import { type ExperienceInteractor } from "../interactors/experience";
import { AppError, Result } from "@resume/core/src";
import { Transaction } from "../../data/types";
import { ErrorType } from "../error";

export type ExperienceUpdateUseCase = UseCase<
  Partial<Experience> & { id: string },
  ExperienceEntity
>;

export function ExperienceUpdateUseCaseFactory(
  interactor: ExperienceInteractor
): ExperienceUpdateUseCase {
  async function execute(
    experience: Partial<Experience> & { id: string }
  ): Promise<Result<ExperienceEntity, AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();
      const result = await interactor.updateExperience(
        experience.id,
        experience,
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
            message: (error as Error).message ?? "Failed to update experience",
            type: ErrorType.PERSISTENCE,
          })
        );
      }
    }
  }
  return { execute };
}
