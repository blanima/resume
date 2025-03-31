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
      );`);
}

export async function down(knex: Knex): Promise<void> {}
