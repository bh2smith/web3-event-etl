import * as process from "process";
import { invokeLambda } from "../src/lambda";

const functionUrl: string =
  process.env["FUNCTION_URL"] ||
  "http://localhost:9000/2015-03-31/functions/function/invocations";
describe("invokeLambda(txHash, solver)", () => {
  // TODO - spin up local instance of AWS lambda and deploy at default URL above.
  test("Invokes Lambda Function", async () => {
    const txHash = "TenderlyUnitTest";
    const solver = "Test";
    await invokeLambda(functionUrl, txHash, solver);
  });
});
