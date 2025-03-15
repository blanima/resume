import { ExperienceEntity } from "../domain/entities/experience";
import { type Transaction } from "./types";
import { Ok, Err, Result, type AppError, createAppErr } from "@resume/core/src"; // Added Err import
import { Clients } from "./clients";

export interface ExperienceGateway {
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  getExperienceById(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>>;
}

const TBL_EXPERIENCES = "experiences";

export function ExperienceGatewayFactory(clients: Clients): ExperienceGateway {
  const client = clients.getDbClient();

  async function beginTrx(): Promise<Transaction> {
    return await client.transaction();
  }

  async function commitTrx(trx: Transaction): Promise<void> {
    await trx.commit();
  }

  async function rollbackTrx(trx: Transaction): Promise<void> {
    await trx.rollback();
  }

  async function getExperienceById(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    const found: any = await client
      .select()
      .from(TBL_EXPERIENCES)
      .where({ id })
      .transacting(trx)
      .first();

    if (!found) {
      return Err(
        createAppErr({ message: `Experience with id ${id} not found` })
      );
    }

    return Ok(ExperienceEntity.create(found));
  }

  return { getExperienceById, beginTrx, commitTrx, rollbackTrx };
}
