import { createAppErr, Err, UseCase } from "@resume/core/src";
import { SkillExperienceLink } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { type Transaction } from "../../data/types";
import { AppError, Result } from "@resume/core/src";
import { ErrorType } from "../error";
import { ExperienceInteractor } from "../interactors/experience";

export interface SkillUnlinkExperienceInput {
  skillId: string;
  experienceId: string;
}

export type SkillUnlinkExperienceUseCase = UseCase<
  SkillUnlinkExperienceInput,
  SkillExperienceLink
>;

export function SkillUnlinkExperienceUseCaseFactory(
  skillInteractor: SkillInteractor,
  experienceInteractor: ExperienceInteractor
): SkillUnlinkExperienceUseCase {
  async function execute(
    input: SkillUnlinkExperienceInput
  ): Promise<Result<SkillExperienceLink, AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await skillInteractor.beginTrx();
      const expExists = await experienceInteractor.exists(
        input.experienceId,
        trx
      );

      if (expExists.isErr() || expExists.unwrap() === false) {
        await skillInteractor.rollbackTrx(trx);
        return Err(
          createAppErr({
            message: "Experience not found",
            ctx: { id: input.experienceId },
            type: ErrorType.EXPERIENCE_NOT_FOUND,
          })
        );
      }

      const result = await skillInteractor.unlinkSkillFromExperience(
        input.skillId,
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
            "Failed to unlink skill from experience",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }
  return { execute };
}
