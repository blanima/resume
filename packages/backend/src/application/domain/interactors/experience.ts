import { ExperienceEntity } from "../entities/experience";
import { ExperienceGateway } from "../../data/gateway";

import { Result, AppError } from "@resume/core/src"; // AppError can be imported similarly if needed

export interface ExperienceInteractor {
  getExperienceById(id: string): Promise<Result<ExperienceEntity, AppError>>;
}

export function ExperienceInteractorFactory(
  gateway: ExperienceGateway
): ExperienceInteractor {
  async function getExperienceById(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    return gateway.getExperienceById(id);
  }
  return { getExperienceById };
}
