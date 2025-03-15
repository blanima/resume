import { ExperienceEntity } from "../entities/experience";
import { ExperienceGateway } from "../../data/gateway";

import { Result, AppError } from "@resume/core/src"; // AppError can be imported similarly if needed
import { type Transaction } from "src/application/data/types";

export interface ExperienceInteractor {
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  getExperienceById(id: string): Promise<Result<ExperienceEntity, AppError>>;
}

export function ExperienceInteractorFactory(
  gateway: ExperienceGateway
): ExperienceInteractor {
  async function beginTrx(): Promise<Transaction> {
    return gateway.beginTrx();
  }

  async function commitTrx(trx: Transaction): Promise<void> {
    return await gateway.commitTrx(trx);
  }

  async function rollbackTrx(trx: Transaction): Promise<void> {
    return await gateway.rollbackTrx(trx);
  }

  async function getExperienceById(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    const trx = await beginTrx();
    const experience = await gateway.getExperienceById(id, trx);

    if (experience.isErr()) {
      await rollbackTrx(trx);
    } else {
      await commitTrx(trx);
    }

    return experience;
  }
  return { getExperienceById, beginTrx, commitTrx, rollbackTrx };
}
