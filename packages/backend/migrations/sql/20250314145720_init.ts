import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  create table if not exists experiences 
  (
    id				    uuid		  not null	default gen_random_uuid()	primary key,
    start_date		timestamp	not null,
    end_date		  timestamp,
    translations  jsonb not null,
    created_at		timestamp	not null  default now(),
    updated_at		timestamp	not null
  );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  drop table if exists experiences CASCADE;
  `);
}
