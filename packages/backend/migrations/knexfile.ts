import { type Knex } from "knex";
import config from "config";

const pool: { min: string; max: string } = config.get("database.postgres.pool");

const configuredUrl: string = config.get("database.postgres.url");

const knexConfig: Knex.Config = {
  client: "pg",
  connection: configuredUrl,
  pool: {
    min: parseInt(pool.min, 10),
    max: parseInt(pool.max, 10),
  },
  migrations: {
    tableName: "migrations",
    directory: "./sql",
    loadExtensions: [".js"],
  },
};

export default knexConfig;
