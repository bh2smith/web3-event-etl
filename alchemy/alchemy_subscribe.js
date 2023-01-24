import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const settlementContractAddress = "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";
const settleTopic = "0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4";

const settlementEvents = {
  address: settlementContractAddress,
  topics: [settleTopic],
};
const doSomethingWithTxn = (txn) => console.log(txn);

// Open the websocket and listen for events!
console.log("Opening settlement event listener...");
alchemy.ws.on(settlementEvents, doSomethingWithTxn);
// Don't know what to do with this: https://docs.alchemy.com/reference/throughput
// response: `{"jsonrpc":"2.0","id":1,"error":{"code":429,"message":"Your app has exceeded its concurrent requests capacity. If you have retries enabled, you can safely ignore this message. If not, check out https://docs.alchemy.com/reference/throughput. Reach out to us if you'd like to increase your limits: https://dashboard.alchemyapi.io/support"}}
