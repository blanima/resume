import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE if not exists skills
    (
      id UUID primary key not null default gen_random_uuid(),
      translations JSONB,
      level VARCHAR(3),
      created_at TIMESTAMP not null default now(),
      updated_at TIMESTAMP
    );
    CREATE TABLE if not exists skills_educations
    (
      skill_id UUID not null,
      education_id UUID not null,
      created_at TIMESTAMP not null default now(),
      constraint pk_skills_educations
        primary key(skill_id, education_id),
      constraint fk_skill
        foreign key(skill_id) references skills(id) on delete cascade,
      constraint fk_education
        foreign key(education_id) references educations(id) on delete cascade
    );
    CREATE TABLE if not exists skills_experiences
    (
      skill_id UUID not null,
      experience_id UUID not null,
      created_at TIMESTAMP not null default now(),
      constraint pk_skills_experiences
        primary key(skill_id, experience_id),
      constraint fk_skill
        foreign key(skill_id) references skills(id) on delete cascade,
      constraint fk_experience
        foreign key(experience_id) references experiences(id) on delete cascade
    );
      `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE if exists skills CASCADE;
    DROP TABLE if exists skills_educations;
    DROP TABLE if exists skills_experiences;
  `);
}
