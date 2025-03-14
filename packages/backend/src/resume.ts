import { ExperienceGatewayFactory } from "./application/data/gateway";
import { ExperienceInteractorFactory } from "./application/domain/interactors/experience";
import { GetExperienceByIdUseCaseFactory } from "./application/domain/useCases/experienceGetById";
import { ExperienceControllerFactory } from "./application/presenters/controller/experience";

export function initResumeApp() {
  const experienceGateway = ExperienceGatewayFactory();

  const experienceInteractor = ExperienceInteractorFactory(experienceGateway);

  const getById = GetExperienceByIdUseCaseFactory(experienceInteractor);

  const resumeController = ExperienceControllerFactory({
    useCases: { getById },
  });

  return resumeController;
}
