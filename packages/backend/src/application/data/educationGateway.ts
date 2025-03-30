import { Education, EducationEntity } from "../domain/entities/education";
import { type Transaction } from "./types";
import { Ok, Err, Result, type AppError, createAppErr } from "@resume/core/src";
import { Clients } from "./clients";
import { ErrorType } from "../domain/error";

export interface EducationGateway {
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  exists(id: string, trx: Transaction): Promise<Result<boolean, AppError>>;
  getEducationById(
    id: string,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>>;
  getManyEducations(
    trx: Transaction
  ): Promise<Result<EducationEntity[], AppError>>;
  addEducation(
    education: Omit<Education, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>>;
  updateEducation(
    id: string,
    education: Partial<Education>,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>>;
  deleteEducation(
    id: string,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>>;
}

const TBL_EDUCATIONS = "educations";

export function EducationGatewayFactory(clients: Clients): EducationGateway {
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
        .from(TBL_EDUCATIONS)
        .where({ id })
        .transacting(trx)
        .first();

      return Ok(!!found);
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            "Failed to check if education exists",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function getEducationById(
    id: string,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>> {
    try {
      const found: any = await client
        .select()
        .from(TBL_EDUCATIONS)
        .where({ id })
        .transacting(trx)
        .first();

      if (!found) {
        return Err(
          createAppErr({
            message: `Education with id ${id} not found`,
            type: ErrorType.EXPERIENCE_NOT_FOUND,
          })
        );
      }

      return Ok(EducationEntity.create(found));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to get education with id ${id}`,
          type: ErrorType.PERSISTENCE,
          ctx: { id },
        })
      );
    }
  }

  async function getManyEducations(
    trx: Transaction
  ): Promise<Result<EducationEntity[], AppError>> {
    try {
      const educations = await client
        .select()
        .from(TBL_EDUCATIONS)
        .transacting(trx);

      return Ok(
        educations.map((edu: Education) => EducationEntity.create(edu))
      );
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ?? "Failed to get educations",
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function addEducation(
    education: Omit<Education, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>> {
    try {
      const now = new Date().toISOString();
      const educationEntry = {
        ...education,
        created_at: now,
      };
      const added = await client<Education>(TBL_EDUCATIONS)
        .insert(educationEntry)
        .transacting(trx)
        .returning<Education[]>("*")
        .then((educations) => educations[0]);

      if (!added) {
        return Err(createAppErr({ message: "Failed to add education" }));
      }

      return Ok(EducationEntity.create(added));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ?? "Failed to add education",
          type: ErrorType.PERSISTENCE,
          ctx: { education },
        })
      );
    }
  }

  async function updateEducation(
    id: string,
    education: Partial<Education>,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>> {
    try {
      const now = new Date().toISOString();
      const updatedEducation = {
        ...education,
        updated_at: now,
      };

      const updatedRawEducation = await client<Education>(TBL_EDUCATIONS)
        .where({ id })
        .update(updatedEducation)
        .transacting(trx)
        .returning<Education[]>("*")
        .then((rows) => rows[0]);

      if (!updatedRawEducation) {
        return Err(
          createAppErr({
            message: "Could not update education",
            type: ErrorType.PERSISTENCE,
            ctx: { id, education },
          })
        );
      }
      return Ok(EducationEntity.create(updatedRawEducation));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to update education with id ${id}`,
          type: ErrorType.PERSISTENCE,
        })
      );
    }
  }

  async function deleteEducation(
    id: string,
    trx: Transaction
  ): Promise<Result<EducationEntity, AppError>> {
    try {
      const deletedEntry = await client<Education>(TBL_EDUCATIONS)
        .where({ id })
        .delete()
        .transacting(trx)
        .returning<Education[]>("*")
        .then((rows) => rows[0]);

      if (!deletedEntry) {
        return Err(
          createAppErr({
            message: `Education not found: ${id} not found`,
            type: ErrorType.EDUCATION_NOT_FOUND,
            ctx: { id },
          })
        );
      }

      return Ok(EducationEntity.create(deletedEntry));
    } catch (error) {
      return Err(
        createAppErr({
          message:
            (error as Error | undefined)?.message ??
            `Failed to delete education with id ${id}`,
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
    getEducationById,
    getManyEducations,
    addEducation,
    updateEducation,
    deleteEducation,
  };
}
