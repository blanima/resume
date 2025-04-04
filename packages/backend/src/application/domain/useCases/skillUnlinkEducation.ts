import { createAppErr, Err, UseCase } from "@resume/core/src";
import { SkillEducationLink } from "../entities/skill";
import { type SkillInteractor } from "../interactors/skill";
import { type Transaction } from "../../data/types";
import { AppError, Result } from "@resume/core/src";
import { ErrorType } from "../error";
import { EducationInteractor } from "../interactors/education";

export interface SkillUnlinkEducationInput {
  skillId: string;
  educationId: string;
}

export type SkillUnlinkEducationUseCase = UseCase<
  {
    skillId: string;
    educationId: string;
  },
  SkillEducationLink
>;

export function SkillUnlinkEducationUseCaseFactory(
  skillInteractor: SkillInteractor,
  educationInteractor: EducationInteractor
): SkillUnlinkEducationUseCase {
  async function execute(
    input: SkillUnlinkEducationInput
  ): Promise<Result<SkillEducationLink, AppError>> {
    let trx: Transaction | undefined;
    try {
      trx = await skillInteractor.beginTrx();
      const eduExists = await educationInteractor.exists(
        input.educationId,
        trx
      );

      if (eduExists.isErr() || eduExists.unwrap() === false) {
        {
          await skillInteractor.rollbackTrx(trx);
          return Err(
            createAppErr({
              message: "Education not found",
              type: ErrorType.EDUCATION_NOT_FOUND,
              ctx: { id: input.educationId },
            })
          );
        }
      }

      const result = await skillInteractor.unlinkSkillFromEducation(
        input.skillId,
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
            (error as Error).message ?? "Failed to unlink skill from education",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }
  return { execute };
}
