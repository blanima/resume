import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
CREATE TABLE if not exists educations
(
  id UUID primary key not null default gen_random_uuid(),
  translations JSONB,
  institution VARCHAR(255),
  degree VARCHAR(255),
  start_date TIMESTAMP not null,
  end_date TIMESTAMP,
  created_at TIMESTAMP not null default now(),
  updated_at TIMESTAMP
);
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
DROP TABLE educations;
`);
}
