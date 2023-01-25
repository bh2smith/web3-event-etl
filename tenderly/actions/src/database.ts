// Most of this code was copied from
// https://www.atdatabases.org/docs/pg-guide-typescript

import createConnectionPool, { sql } from "@databases/pg";
import tables from "@databases/pg-typed";
import DatabaseSchema from "./__generated__";

export { sql };

// You can list whatever tables you actually have here:
const { event_tx_hashes } = tables<DatabaseSchema>({
  databaseSchema: require("./__generated__/schema.json"),
});

async function insertSettlementEvent(
  dbURL: string,
  txHash: string,
  solver: string
) {
  const db = createConnectionPool({
    connectionString: dbURL,
    bigIntMode: "bigint",
  });
  console.log(`Inserting Settlement(txHash, solver) = (${txHash}, ${solver})`);
  await event_tx_hashes(db).insert({ tx_hash: txHash, solver: solver });
  console.log("success!");
}
export { event_tx_hashes, insertSettlementEvent };
