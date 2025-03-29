import { type Experience, ExperienceEntity } from "../entities/experience";
import { ExperienceGateway } from "../../data/experienceGateway";

import { Result, AppError } from "@resume/core/src"; // AppError can be imported similarly if needed
import { type Transaction } from "src/application/data/types";

export interface ExperienceInteractor {
  beginTrx(): Promise<Transaction>;
  commitTrx(trx: Transaction): Promise<void>;
  rollbackTrx(trx: Transaction): Promise<void>;
  getExperienceById(id: string): Promise<Result<ExperienceEntity, AppError>>;
  getManyExperiences(): Promise<Result<ExperienceEntity[], AppError>>;
  addExperience(
    experience: Omit<Experience, "id" | "created_at" | "updated_at">
  ): Promise<Result<ExperienceEntity, AppError>>;
  updateExperience(
    id: string,
    experience: Partial<Experience>
  ): Promise<Result<ExperienceEntity, AppError>>;
  deleteExperience(id: string): Promise<Result<ExperienceEntity, AppError>>;
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

  async function getManyExperiences(): Promise<
    Result<ExperienceEntity[], AppError>
  > {
    const trx = await beginTrx();
    const experiences = await gateway.getManyExperiences(trx);

    if (experiences.isErr()) {
      await rollbackTrx(trx);
    } else {
      await commitTrx(trx);
    }

    return experiences;
  }

  async function addExperience(
    experience: Omit<Experience, "id" | "created_at" | "updated_at">
  ): Promise<Result<ExperienceEntity, AppError>> {
    const trx = await beginTrx();
    const addedExperience = await gateway.addExperience(experience, trx);

    if (addedExperience.isErr()) {
      await rollbackTrx(trx);
    } else {
      await commitTrx(trx);
    }

    return addedExperience;
  }

  async function updateExperience(
    id: string,
    experience: Partial<Experience>
  ): Promise<Result<ExperienceEntity, AppError>> {
    const trx = await beginTrx();
    const updatedExperience = await gateway.updateExperience(
      id,
      experience,
      trx
    );

    if (updatedExperience.isErr()) {
      await rollbackTrx(trx);
    } else {
      await commitTrx(trx);
    }

    return updatedExperience;
  }

  async function deleteExperience(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    const trx = await beginTrx();
    const result = await gateway.deleteExperience(id, trx);
    if (result.isErr()) {
      await rollbackTrx(trx);
    } else {
      await commitTrx(trx);
    }
    return result;
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
  };
}
