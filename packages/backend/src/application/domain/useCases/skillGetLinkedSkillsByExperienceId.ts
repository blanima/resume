import { createAppErr, Err, UseCase } from "@resume/core/src";
import { SkillExperienceLink } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { type Transaction } from "../../data/types";
import { AppError, Result } from "@resume/core/src";
import { ErrorType } from "../error";

export interface SkillGetLinkedSkillsByExperienceIdInput {
  experienceId: string;
}

export type SkillGetLinkedSkillsByExperienceIdUseCase = UseCase<
  SkillGetLinkedSkillsByExperienceIdInput,
  SkillExperienceLink[]
>;

export function SkillGetLinkedSkillsByExperienceIdUseCaseFactory(
  skillInteractor: SkillInteractor
): SkillGetLinkedSkillsByExperienceIdUseCase {
  async function execute(
    input: SkillGetLinkedSkillsByExperienceIdInput
  ): Promise<Result<SkillExperienceLink[], AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await skillInteractor.beginTrx();
      const result = await skillInteractor.getLinkedSkillsByExperienceId(
        input.experienceId,
        trx
      );
      if (result.isErr()) {
        await skillInteractor.rollbackTrx(trx);
        return result;
      }
      await skillInteractor.commitTrx(trx);
      return result;
    } catch (error) {
      if (trx) await skillInteractor.rollbackTrx(trx);
      return Err(
        createAppErr({
          message:
            (error as Error).message ??
            "Failed to get linked skills by experience id",
          type: ErrorType.PERSISTENCE,
          ctx: { experienceId: input.experienceId },
        })
      );
    }
  }
  return { execute };
}
