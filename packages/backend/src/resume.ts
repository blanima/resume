import getClients from "./application/data/clients";
import { ExperienceGatewayFactory } from "./application/data/gateway";
import { ExperienceInteractorFactory } from "./application/domain/interactors/experience";
import { GetExperienceByIdUseCaseFactory } from "./application/domain/useCases/experienceGetById";
import { ExperienceControllerFactory } from "./application/presenters/controller/experience";

export function initResumeApp() {
  const clients = getClients();
  const experienceGateway = ExperienceGatewayFactory(clients);

  const experienceInteractor = ExperienceInteractorFactory(experienceGateway);

  const getById = GetExperienceByIdUseCaseFactory(experienceInteractor);

  const resumeController = ExperienceControllerFactory({
    useCases: { getById },
  });

  return resumeController;
}
