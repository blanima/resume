import knex from "knex";
import config from "config";

const pool: { min: string; max: string } = config.get("database.postgres.pool");

const url: string = config.get("database.postgres.url");

const knexPgConfig: knex.Knex.Config = {
  connection: url,
  pool: {
    min: parseInt(pool.min, 10),
    max: parseInt(pool.max, 10),
  },
  client: "pg",
};

export default knex(knexPgConfig);
