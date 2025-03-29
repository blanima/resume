import {
  type Experience,
  ExperienceEntity,
} from "../domain/entities/experience";
import { type Transaction } from "./types";
import { Ok, Err, Result, type AppError, createAppErr } from "@resume/core/src"; // Added Err import
import { Clients } from "./clients";
import { ErrorType } from "../domain/error";

export interface ExperienceGateway {
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  exists(id: string, trx: Transaction): Promise<Result<boolean, AppError>>;
  getExperienceById(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>>;
  // TODO: implement pagination
  getManyExperiences(
    trx: Transaction
  ): Promise<Result<ExperienceEntity[], AppError>>;
  addExperience(
    experience: Omit<Experience, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>>;
  updateExperience(
    id: string,
    experience: Partial<Experience>,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>>;
  deleteExperience(
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

  async function exists(
    id: string,
    trx: Transaction
  ): Promise<Result<boolean, AppError>> {
    try {
      const found = await client
        .select()
        .from(TBL_EXPERIENCES)
        .where({ id })
        .transacting(trx)
        .first();

      return Ok(!!found);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to check if experience exists",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function getExperienceById(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    try {
      const found: any = await client
        .select()
        .from(TBL_EXPERIENCES)
        .where({ id })
        .transacting(trx)
        .first();

      if (!found) {
        return Err(
          createAppErr({
            message: `Experience with id ${id} not found`,
            type: ErrorType.EXPERIENCE_NOT_FOUND,
          })
        );
      }

      return Ok(ExperienceEntity.create(found));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to get experience with id ${id}`,
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function getManyExperiences(
    trx: Transaction
  ): Promise<Result<ExperienceEntity[], AppError>> {
    try {
      const experiences = await client
        .select()
        .from(TBL_EXPERIENCES)
        .transacting(trx);

      return Ok(experiences.map((exp) => ExperienceEntity.create(exp)));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to get experiences",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function addExperience(
    experience: Omit<Experience, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    try {
      const now = new Date().toISOString();
      const experienceEntry = {
        ...experience,
        created_at: now,
        updated_at: now,
      };
      const added = await client(TBL_EXPERIENCES)
        .insert(experienceEntry)
        .transacting(trx)
        .returning("*")
        .first();

      if (!added) {
        return Err(createAppErr({ message: "Failed to add experience" }));
      }

      return Ok(ExperienceEntity.create(added));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ?? "Failed to add experience",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function updateExperience(
    id: string,
    experience: Partial<Experience>,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    try {
      const now = new Date().toISOString();
      const updatedExperience = {
        ...experience,
        updated_at: now,
      };

      await client(TBL_EXPERIENCES)
        .where({ id })
        .update(updatedExperience)
        .returning("*");

      const e = await getExperienceById(id, trx);
      if (e.isErr()) {
        return e;
      }

      return Ok(e.unwrap());
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to update experience with id ${id}`,
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function deleteExperience(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    try {
      const deletedEntry = await client(TBL_EXPERIENCES)
        .where({ id })
        .delete()
        .transacting(trx)
        .returning("*")
        .first();

      if (!deletedEntry) {
        return Err(
          // TODO: add error type
          createAppErr({ message: `Experience with id ${id} not found` })
        );
      }

      return Ok(ExperienceEntity.create(deletedEntry));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to delete experience with id ${id}`,
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  return {
    beginTrx,
    commitTrx,
    rollbackTrx,
    exists,
    getExperienceById,
    getManyExperiences,
    addExperience,
    updateExperience,
    deleteExperience,
  };
}
