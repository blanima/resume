import { createAppErr, Err, UseCase } from "@resume/core/src";
import { type Skill, SkillEntity } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { AppError, Result } from "@resume/core/src";
import { Transaction } from "../../data/types";
import { ErrorType } from "../error";

export type SkillAddUseCase = UseCase<
  Omit<Skill, "id" | "created_at" | "updated_at">,
  SkillEntity
>;

export function SkillAddUseCaseFactory(
  interactor: SkillInteractor
): SkillAddUseCase {
  async function execute(
    skill: Omit<Skill, "id" | "created_at" | "updated_at">
  ): Promise<Result<SkillEntity, AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await interactor.beginTrx();
      const result = await interactor.addSkill(skill, trx);
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
            message: (error as Error).message ?? "Failed to add skill",
            type: ErrorType.PERSISTENCE,
          })
        );
    }
  }
  return { execute };
}
