import { createAppErr, Err, UseCase } from "@resume/core/src";
import { SkillEducationLink } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { type Transaction } from "../../data/types";
import { AppError, Result } from "@resume/core/src";
import { ErrorType } from "../error";

export interface SkillGetLinkedSkillsByEducationIdInput {
  educationId: string;
}

export type SkillGetLinkedSkillsByEducationIdUseCase = UseCase<
  SkillGetLinkedSkillsByEducationIdInput,
  SkillEducationLink[]
>;

export function SkillGetLinkedSkillsByEducationIdUseCaseFactory(
  skillInteractor: SkillInteractor
): SkillGetLinkedSkillsByEducationIdUseCase {
  async function execute(
    input: SkillGetLinkedSkillsByEducationIdInput
  ): Promise<Result<SkillEducationLink[], AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await skillInteractor.beginTrx();
      const result = await skillInteractor.getLinkedSkillsByEducationId(
        input.educationId,
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
            "Failed to get linked skills by education id",
          type: ErrorType.PERSISTENCE,
          ctx: { educationId: input.educationId },
        })
      );
    }
  }
  return { execute };
}
