import {
  EducationEntity,
  type Education /* EducationEntity not needed here, see usage below */,
} from "../entities/education";
import { EducationGateway } from "../../data/educationGateway";
import { Result, AppError } from "@resume/core/src";
import { type Transaction } from "../../data/types";

export interface EducationInteractor {
  // Transaction management
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  // Gateway operations
  getEducationById(id: string): Promise<Result<EducationEntity, AppError>>;
  getManyEducations(): Promise<Result<EducationEntity[], AppError>>;
  addEducation(
    education: Omit<Education, "id" | "created_at" | "updated_at">
  ): Promise<Result<EducationEntity, AppError>>;
  updateEducation(
    id: string,
    education: Partial<Education>
  ): Promise<Result<EducationEntity, AppError>>;
  deleteEducation(id: string): Promise<Result<EducationEntity, AppError>>;
}

export function EducationInteractorFactory(
  gateway: EducationGateway
): EducationInteractor {
  async function beginTrx(): Promise<Transaction> {
    return gateway.beginTrx();
  }

  async function commitTrx(trx: Transaction): Promise<void> {
    return gateway.commitTrx(trx);
  }

  async function rollbackTrx(trx: Transaction): Promise<void> {
    return gateway.rollbackTrx(trx);
  }

  async function getEducationById(
    id: string
  ): Promise<Result<EducationEntity, AppError>> {
    const trx = await beginTrx();

    const result = await gateway.getEducationById(id, trx);

    result.isErr() ? await rollbackTrx(trx) : await commitTrx(trx);

    return result;
  }

  async function getManyEducations(): Promise<
    Result<EducationEntity[], AppError>
  > {
    const trx = await beginTrx();

    const result = await gateway.getManyEducations(trx);

    result.isErr() ? await rollbackTrx(trx) : await commitTrx(trx);

    return result;
  }

  async function addEducation(
    education: Omit<Education, "id" | "created_at" | "updated_at">
  ): Promise<Result<EducationEntity, AppError>> {
    const trx = await beginTrx();

    const result = await gateway.addEducation(education, trx);

    result.isErr() ? await rollbackTrx(trx) : await commitTrx(trx);
    return result;
  }

  async function updateEducation(
    id: string,
    education: Partial<Education>
  ): Promise<Result<EducationEntity, AppError>> {
    const trx = await beginTrx();

    const result = await gateway.updateEducation(id, education, trx);

    result.isErr() ? await rollbackTrx(trx) : await commitTrx(trx);

    return result;
  }

  async function deleteEducation(
    id: string
  ): Promise<Result<EducationEntity, AppError>> {
    const trx = await beginTrx();

    const result = await gateway.deleteEducation(id, trx);

    result.isErr() ? await rollbackTrx(trx) : await commitTrx(trx);

    return result;
  }

  return {
    beginTrx,
    commitTrx,
    rollbackTrx,
    getEducationById,
    getManyEducations,
    addEducation,
    updateEducation,
    deleteEducation,
  };
}
