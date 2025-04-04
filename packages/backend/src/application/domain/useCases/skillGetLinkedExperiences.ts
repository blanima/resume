import { createAppErr, Err, UseCase } from "@resume/core/src";
import { SkillExperienceLink } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { type Transaction } from "../../data/types";
import { AppError, Result } from "@resume/core/src";
import { ErrorType } from "../error";

export interface SkillGetLinkedExperiencesInput {
  skillId: string;
}

export type SkillGetLinkedExperiencesUseCase = UseCase<
  SkillGetLinkedExperiencesInput,
  SkillExperienceLink[]
>;

export function SkillGetLinkedExperiencesUseCaseFactory(
  skillInteractor: SkillInteractor
): SkillGetLinkedExperiencesUseCase {
  async function execute(
    input: SkillGetLinkedExperiencesInput
  ): Promise<Result<SkillExperienceLink[], AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await skillInteractor.beginTrx();
      const result = await skillInteractor.getLinkedExperiences(
        input.skillId,
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
            (error as Error).message ?? "Failed to get linked experiences",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId: input.skillId },
        })
      );
    }
  }
  return { execute };
}
