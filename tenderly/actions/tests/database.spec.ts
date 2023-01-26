import { getDB, insertSettlementEvent } from "../src/database";
import * as process from "process";

const dbURL: string =
  process.env["DATABASE_URL"] || "postgresql://postgres:postgres@localhost:5432/postgres";
const db = getDB(dbURL);
describe("insertSettlementEvent(txHash, solver)", () => {
  test("Inserts to DB", async () => {
    const txHash =
      "0x45f52ee09622eac16d0fe27b90a76749019b599c9566f10e21e8d0955a0e428e";
    const solver = "0xc9ec550bea1c64d779124b23a26292cc223327b6";
    await insertSettlementEvent(db, txHash, solver);
  });
});
