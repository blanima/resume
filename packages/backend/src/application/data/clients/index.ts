import knexPgClient from "./knex-pg";
import { Knex } from "knex";

export interface Clients {
  getDbClient: () => Knex;
}

export default function getClients(): Clients {
  return {
    getDbClient: () => knexPgClient,
  };
}
