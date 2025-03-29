import getClients from "./application/data/clients";
import { ExperienceGatewayFactory } from "./application/data/experienceGateway";
import { experienceDomain } from "./application/domain/experienceDomain";
import { ExperienceControllerFactory } from "./application/presenters/controller/experience";
import { ExperienceDeleteUseCaseFactory } from "./application/domain/useCases/experienceDelete";

export function initResumeApp() {
  const clients = getClients();
  const experienceGateway = ExperienceGatewayFactory(clients);

  const experienceInteractor =
    experienceDomain.interactors.Experience(experienceGateway);

  const getById = experienceDomain.useCases.GetById(experienceInteractor);
  const getMany = experienceDomain.useCases.GetMany(experienceInteractor);
  const add = experienceDomain.useCases.Add(experienceInteractor);
  const update = experienceDomain.useCases.Update(experienceInteractor);
  const deleteUseCase = ExperienceDeleteUseCaseFactory(experienceInteractor);

  const experienceController = ExperienceControllerFactory({
    useCases: {
      getById,
      getMany,
      add,
      update,
      deleteExperience: deleteUseCase,
    },
  });

  return experienceController;
}
