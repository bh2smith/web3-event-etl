// Most of this code was copied from
// https://www.atdatabases.org/docs/pg-guide-typescript

import createConnectionPool, { sql } from "@databases/pg";
import tables from "@databases/pg-typed";
import ConnectionPool from "@databases/pg/lib/types/Queryable"
import DatabaseSchema from "./__generated__";

export { sql };

// You can list whatever tables you actually have here:
const { event_tx_hashes } = tables<DatabaseSchema>({
  databaseSchema: require("./__generated__/schema.json"),
});

function getDB(dbURL: string): ConnectionPool {
  return createConnectionPool({
    connectionString: dbURL,
    bigIntMode: "bigint",
  });
}
async function insertSettlementEvent(
  db: ConnectionPool,
  txHash: string,
  solver: string
) {
  console.log(`Inserting Settlement(txHash, solver) = (${txHash}, ${solver})`);
  await event_tx_hashes(db).insert({ tx_hash: txHash, solver: solver });
  console.log("success!");
}
export { event_tx_hashes, insertSettlementEvent, getDB };
