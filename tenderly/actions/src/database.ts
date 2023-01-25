// database.ts

import createConnectionPool, { sql } from "@databases/pg";
import tables from "@databases/pg-typed";
import DatabaseSchema from "./__generated__";

export { sql };

const db = createConnectionPool();
export default db;

// You can list whatever tables you actually have here:
const { event_tx_hashes } = tables<DatabaseSchema>({
  databaseSchema: require("./__generated__/schema.json"),
});
export { event_tx_hashes };
