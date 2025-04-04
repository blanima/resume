import { createAppErr, Err, UseCase } from "@resume/core/src";
import { SkillEducationLink } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { type Transaction } from "../../data/types";
import { AppError, Result } from "@resume/core/src";
import { ErrorType } from "../error";

export interface SkillGetLinkedEducationsInput {
  skillId: string;
}

export type SkillGetLinkedEducationsUseCase = UseCase<
  SkillGetLinkedEducationsInput,
  SkillEducationLink[]
>;

export function SkillGetLinkedEducationsUseCaseFactory(
  skillInteractor: SkillInteractor
): SkillGetLinkedEducationsUseCase {
  async function execute(
    input: SkillGetLinkedEducationsInput
  ): Promise<Result<SkillEducationLink[], AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await skillInteractor.beginTrx();
      const result = await skillInteractor.getLinkedEducations(
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
            (error as Error).message ?? "Failed to get linked educations",
          type: ErrorType.PERSISTENCE,
          ctx: { skillId: input.skillId },
        })
      );
    }
  }
  return { execute };
}
