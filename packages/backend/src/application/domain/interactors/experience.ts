import { type Experience, ExperienceEntity } from "../entities/experience";
import { ExperienceGateway } from "../../data/experienceGateway";

import { Result, AppError } from "@resume/core/src"; // AppError can be imported similarly if needed
import { type Transaction } from "src/application/data/types";

export interface ExperienceInteractor {
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  getExperienceById(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>>;
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
  exists(id: string, trx: Transaction): Promise<Result<boolean, AppError>>;
}

export function ExperienceInteractorFactory(
  gateway: ExperienceGateway
): ExperienceInteractor {
  async function beginTrx(): Promise<Transaction> {
    return gateway.beginTrx();
  }

  async function commitTrx(trx: Transaction): Promise<void> {
    await gateway.commitTrx(trx);
  }

  async function rollbackTrx(trx: Transaction): Promise<void> {
    await gateway.rollbackTrx(trx);
  }

  async function getExperienceById(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    return gateway.getExperienceById(id, trx);
  }

  async function getManyExperiences(
    trx: Transaction
  ): Promise<Result<ExperienceEntity[], AppError>> {
    return gateway.getManyExperiences(trx);
  }

  async function addExperience(
    experience: Omit<Experience, "id" | "created_at" | "updated_at">,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    return gateway.addExperience(experience, trx);
  }

  async function updateExperience(
    id: string,
    experience: Partial<Experience>,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    return gateway.updateExperience(id, experience, trx);
  }

  async function deleteExperience(
    id: string,
    trx: Transaction
  ): Promise<Result<ExperienceEntity, AppError>> {
    return gateway.deleteExperience(id, trx);
  }

  async function exists(
    id: string,
    trx: Transaction
  ): Promise<Result<boolean, AppError>> {
    return gateway.exists(id, trx);
  }

  return {
    beginTrx,
    commitTrx,
    rollbackTrx,
    getExperienceById,
    getManyExperiences,
    addExperience,
    updateExperience,
    deleteExperience,
    exists,
  };
}
