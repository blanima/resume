import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
CREATE TABLE if not exists experiences 
(
  id UUID primary key not null default gen_random_uuid(),
  translations JSONB,
  company_name VARCHAR(255),
  start_date TIMESTAMP default now(),
  end_date TIMESTAMP,
  created_at TIMESTAMP not null default now(),
  updated_at TIMESTAMP
);
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  drop table if exists experiences CASCADE;
  `);
}
