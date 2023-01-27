
import * as process from "process";
import {invokeLambda} from "../src/lambda";

const functionUrl: string = process.env["FUNCTION_URL"] || "http://localhost:9000/2015-03-31/functions/function/invocations";
describe("invokeLambda(txHash, solver)", () => {
  // TODO - spin up local instance of AWS lambda and deploy at default URL above.
  test("Invokes Lambda Function", async () => {
    const txHash =  "0x45f52ee09622eac16d0fe27b90a76749019b599c9566f10e21e8d0955a0e428e";
    const solver = "0xc9ec550bea1c64d779124b23a26292cc223327b6";
    await invokeLambda(functionUrl, txHash, solver);
  });
});
