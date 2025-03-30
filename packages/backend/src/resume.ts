import getClients from "./application/data/clients";
import { ExperienceGatewayFactory } from "./application/data/experienceGateway";
import { experienceDomain } from "./application/domain/experienceDomain";
import { ExperienceControllerFactory } from "./application/presenters/controller/experience";
import { ExperienceDeleteUseCaseFactory } from "./application/domain/useCases/experienceDelete";
import { EducationGatewayFactory } from "./application/data/educationGateway";
import { educationDomain } from "./application/domain/educationDomain";
import { EducationControllerFactory } from "./application/presenters/controller/education";
import { EducationDeleteUseCaseFactory } from "./application/domain/useCases/educationDelete";

export function initResumeApp() {
  const clients = getClients();

  // Experience implementation
  const experienceGateway = ExperienceGatewayFactory(clients);
  const experienceInteractor =
    experienceDomain.interactors.Experience(experienceGateway);
  const experienceGetById =
    experienceDomain.useCases.GetById(experienceInteractor);
  const experienceGetMany =
    experienceDomain.useCases.GetMany(experienceInteractor);
  const experienceAdd = experienceDomain.useCases.Add(experienceInteractor);
  const experienceUpdate =
    experienceDomain.useCases.Update(experienceInteractor);
  const experienceDeleteUseCase =
    ExperienceDeleteUseCaseFactory(experienceInteractor);

  const experienceController = ExperienceControllerFactory({
    useCases: {
      getById: experienceGetById,
      getMany: experienceGetMany,
      add: experienceAdd,
      update: experienceUpdate,
      deleteExperience: experienceDeleteUseCase,
    },
  });

  // Education implementation
  const educationGateway = EducationGatewayFactory(clients);
  const educationInteractor =
    educationDomain.interactors.Education(educationGateway);
  const educationGetById =
    educationDomain.useCases.GetById(educationInteractor);
  const educationGetMany =
    educationDomain.useCases.GetMany(educationInteractor);
  const educationAdd = educationDomain.useCases.Add(educationInteractor);
  const educationUpdate = educationDomain.useCases.Update(educationInteractor);
  const educationDeleteUseCase =
    EducationDeleteUseCaseFactory(educationInteractor);

  const educationController = EducationControllerFactory({
    useCases: {
      getById: educationGetById,
      getMany: educationGetMany,
      add: educationAdd,
      update: educationUpdate,
      deleteEducation: educationDeleteUseCase,
    },
  });

  return {
    experience: experienceController,
    education: educationController,
  };
}
