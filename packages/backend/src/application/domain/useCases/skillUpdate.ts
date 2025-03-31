import { createAppErr, Err, UseCase } from "@resume/core/src";
import { type Skill, SkillEntity } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { AppError, Result } from "@resume/core/src";
import { Transaction } from "../../data/types";
import { ErrorType } from "../error";

export type SkillUpdateUseCase = UseCase<
  { id: string; changes: Partial<Skill> },
  SkillEntity
>;

export function SkillUpdateUseCaseFactory(
  interactor: SkillInteractor
): SkillUpdateUseCase {
  async function execute(input: {
    id: string;
    changes: Partial<Skill>;
  }): Promise<Result<SkillEntity, AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();

      const result = await interactor.updateSkill(input.id, input.changes, trx);
      if (result.isErr()) {
        await interactor.rollbackTrx(trx);
        return result;
      }
      await interactor.commitTrx(trx);
      return result;
    } catch (error) {
      if (trx) await interactor.rollbackTrx(trx);
      if (typeof (error as AppError).type === "string")
        return Err(error as AppError);
      else
        return Err(
          createAppErr({
            message: (error as Error).message ?? "Failed to update skill",
            type: ErrorType.PERSISTENCE,
          })
        );
    }
  }
  return { execute };
}
