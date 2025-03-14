import { Experience, ExperienceEntity } from "../domain/entities/experience";
import { Ok, Err, Result, type AppError, createAppErr } from "@resume/core/src"; // Added Err import

// Replace dummy data with sample experiences.
const EXPERIENCE_DUMMY_DATA: Experience[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Software Developer",
    company: "Tech Corp",
    start_date: "2018-06-01",
    end_date: "2020-08-31",
    translations: { en: "Developer", de: "Entwickler" },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Senior Software Developer",
    company: "Innovate LLC",
    start_date: "2020-09-01",
    end_date: "2023-03-31",
    translations: { en: "Senior Developer", de: "Senior Entwickler" },
  },
];

export interface ExperienceGateway {
  getExperienceById(id: string): Promise<Result<ExperienceEntity, AppError>>;
}

export function ExperienceGatewayFactory(): ExperienceGateway {
  async function getExperienceById(
    id: string
  ): Promise<Result<ExperienceEntity, AppError>> {
    const found = EXPERIENCE_DUMMY_DATA.find((exp) => exp.id === id);

    if (!found) {
      return Err(
        createAppErr({ message: `Experience with id ${id} not found` })
      );
    }

    return Ok(ExperienceEntity.create(found));
  }

  return { getExperienceById };
}
