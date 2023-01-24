import {
  // Functions
  addressFromBytes,
  classifyTransfer,
  partitionEventLogs,
  transferTypeFrom,
  settlementEventHandler,
  // Types
  // ClassifiedEvents,
  // SettlementEvent,
  // SettlementTransfer,
  // TradeEvent,
  // TransferEvent,
  TransferType,
  SETTLEMENT_CONTRACT_ADDRESS,
  TransactionData,
} from "../settlement_hook";
const USER_ADDRESS = "0x1";
const AMM_ADDRESS = "0x2";
const IRRELEVANT_ADDRESS = "0x2";
describe("settlementEventHandler(event)", () => {
  test("parses events from transaction receipt", () => {
    const PAYLOAD_EXAMPLE = {
      hash: "0x05b4cde49fe3e4da7a68e405d70384e1a2121586e8b12e97f879a01279c752ba",
      logs: [
        {
          address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
          topics: [
            "0xa07a543ab8a018198e99ca0184c93fe9050a79400a0a723441f84de1d972cc17",
            "0x000000000000000000000000d5553c9726ea28e7ebedfe9879cf8ab4d061dbf0",
          ],
          data: "0x000000000000000000000000be9895146f7af43049ca1c1ae358b0541ea49704000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000d02ab486cedc0000000000000000000000000000000000000000000000000000d11693b7c555c1990000000000000000000000000000000000000000000000000007e5ed2310a8ac00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000382f52ad47455f01aecc3f7d8629201139c80e5e6fca6917b48b3df4e4650f421ad5553c9726ea28e7ebedfe9879cf8ab4d061dbf063cfc42e0000000000000000",
        },
        {
          address: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000d5553c9726ea28e7ebedfe9879cf8ab4d061dbf0",
            "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
          ],
          data: "0x000000000000000000000000000000000000000000000000d02ab486cedc0000",
        },
        {
          address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000840deeef2f115cf50da625f7368c24af6fe74410",
            "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
          ],
          data: "0x000000000000000000000000000000000000000000000000d11693b7c555c199",
        },
        {
          address: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
            "0x000000000000000000000000840deeef2f115cf50da625f7368c24af6fe74410",
          ],
          data: "0x000000000000000000000000000000000000000000000000d022ce99abcb5754",
        },
        {
          address: "0x840deeef2f115cf50da625f7368c24af6fe74410",
          topics: [
            "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
            "0x0000000000000000000000001111111254eeb25477b68fb85ed929f73a960582",
            "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
          ],
          data: "0x000000000000000000000000000000000000000000000000d022ce99abcb5754ffffffffffffffffffffffffffffffffffffffffffffffff2ee96c483aaa3e67000000000000000000000000000000000000000100a58b9f66db627c39c9562d00000000000000000000000000000000000000000000a727cb1eb914126542940000000000000000000000000000000000000000000000000000000000000032",
        },
        {
          address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
          topics: [
            "0xed99827efb37016f2275f98c4bcf71c7551c75d59e9b450f79fa32e60be672c2",
            "0x0000000000000000000000001111111254eeb25477b68fb85ed929f73a960582",
          ],
          data: "0x0000000000000000000000000000000000000000000000000000000000000000e449022e00000000000000000000000000000000000000000000000000000000",
        },
        {
          address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          topics: [
            "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
            "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
          ],
          data: "0x000000000000000000000000000000000000000000000000d11693b7c555c199",
        },
        {
          address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
          topics: [
            "0xed99827efb37016f2275f98c4bcf71c7551c75d59e9b450f79fa32e60be672c2",
            "0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          ],
          data: "0x00000000000000000000000000000000000000000000000000000000000000002e1a7d4d00000000000000000000000000000000000000000000000000000000",
        },
        {
          address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
          topics: [
            "0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4",
            "0x000000000000000000000000b20b86c4e6deeb432a22d773a221898bbbd03036",
          ],
          data: "0x",
        },
      ],
    };
    const parsedTransaction = settlementEventHandler(PAYLOAD_EXAMPLE);
    const expectedOutput: TransactionData = {
      hash: "0x05b4cde49fe3e4da7a68e405d70384e1a2121586e8b12e97f879a01279c752ba",
      solver: "0xb20b86c4e6deeb432a22d773a221898bbbd03036",
      transfers: [
        {
          amount: BigInt("14997776868504721236"),
          from: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
          to: "0x840deeef2f115cf50da625f7368c24af6fe74410",
          type: 1,
        },
        {
          amount: BigInt("15066392020913602969"),
          from: "0x840deeef2f115cf50da625f7368c24af6fe74410",
          to: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
          type: 0,
        },
        {
          amount: BigInt("15000000000000000000"),
          from: "0xd5553c9726ea28e7ebedfe9879cf8ab4d061dbf0",
          to: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
          type: 2,
        },
      ],
    };
    expect(parsedTransaction.hash).toBe(expectedOutput.hash);
    expect(parsedTransaction.solver).toBe(expectedOutput.solver);
    expect(parsedTransaction.transfers).toStrictEqual(expectedOutput.transfers);
  });
});
describe("partitionEventLogs(logs)", () => {
  test("partitions events from transaction logs as expected", () => {
    const logs = [
      {
        address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
        topics: [
          "0xa07a543ab8a018198e99ca0184c93fe9050a79400a0a723441f84de1d972cc17",
          "0x000000000000000000000000d5553c9726ea28e7ebedfe9879cf8ab4d061dbf0",
        ],
        data: "0x000000000000000000000000be9895146f7af43049ca1c1ae358b0541ea49704000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000d02ab486cedc0000000000000000000000000000000000000000000000000000d11693b7c555c1990000000000000000000000000000000000000000000000000007e5ed2310a8ac00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000382f52ad47455f01aecc3f7d8629201139c80e5e6fca6917b48b3df4e4650f421ad5553c9726ea28e7ebedfe9879cf8ab4d061dbf063cfc42e0000000000000000",
      },
      {
        address: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000d5553c9726ea28e7ebedfe9879cf8ab4d061dbf0",
          "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
        ],
        data: "0x000000000000000000000000000000000000000000000000d02ab486cedc0000",
      },
      {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000840deeef2f115cf50da625f7368c24af6fe74410",
          "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
        ],
        data: "0x000000000000000000000000000000000000000000000000d11693b7c555c199",
      },
      {
        address: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
          "0x000000000000000000000000840deeef2f115cf50da625f7368c24af6fe74410",
        ],
        data: "0x000000000000000000000000000000000000000000000000d022ce99abcb5754",
      },
      {
        address: "0x840deeef2f115cf50da625f7368c24af6fe74410",
        topics: [
          "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
          "0x0000000000000000000000001111111254eeb25477b68fb85ed929f73a960582",
          "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
        ],
        data: "0x000000000000000000000000000000000000000000000000d022ce99abcb5754ffffffffffffffffffffffffffffffffffffffffffffffff2ee96c483aaa3e67000000000000000000000000000000000000000100a58b9f66db627c39c9562d00000000000000000000000000000000000000000000a727cb1eb914126542940000000000000000000000000000000000000000000000000000000000000032",
      },
      {
        address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
        topics: [
          "0xed99827efb37016f2275f98c4bcf71c7551c75d59e9b450f79fa32e60be672c2",
          "0x0000000000000000000000001111111254eeb25477b68fb85ed929f73a960582",
        ],
        data: "0x0000000000000000000000000000000000000000000000000000000000000000e449022e00000000000000000000000000000000000000000000000000000000",
      },
      {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        topics: [
          "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
          "0x0000000000000000000000009008d19f58aabd9ed0d60971565aa8510560ab41",
        ],
        data: "0x000000000000000000000000000000000000000000000000d11693b7c555c199",
      },
      {
        address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
        topics: [
          "0xed99827efb37016f2275f98c4bcf71c7551c75d59e9b450f79fa32e60be672c2",
          "0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        ],
        data: "0x00000000000000000000000000000000000000000000000000000000000000002e1a7d4d00000000000000000000000000000000000000000000000000000000",
      },
      {
        address: "0x9008d19f58aabd9ed0d60971565aa8510560ab41",
        topics: [
          "0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4",
          "0x000000000000000000000000b20b86c4e6deeb432a22d773a221898bbbd03036",
        ],
        data: "0x",
      },
    ];
    const { trades, transfers, settlements } = partitionEventLogs(logs);
    expect(settlements.length).toBe(1);
    expect(trades.length).toBe(1);
    expect(transfers.length).toBe(3);
  });
});
describe("addressFromBytes(hexStr)", () => {
  test("parses address from bytes", () => {
    const address = "0x9008d19f58aabd9ed0d60971565aa8510560ab41";
    const addressTopic = "0x000000000000000000000000" + address;
    expect(addressFromBytes(addressTopic)).toBe(address);
  });
});

describe("transferTypeFrom(isUser, isIncoming)", () => {
  test("assigns correct TransferType for all input combinations", () => {
    const zeroAddress = "0x";
    expect(
      transferTypeFrom(true, SETTLEMENT_CONTRACT_ADDRESS, {
        to: SETTLEMENT_CONTRACT_ADDRESS,
        from: zeroAddress,
        amount: BigInt(0),
      })
    ).toBe(TransferType.USER_IN);
    expect(
      transferTypeFrom(true, SETTLEMENT_CONTRACT_ADDRESS, {
        from: SETTLEMENT_CONTRACT_ADDRESS,
        to: zeroAddress,
        amount: BigInt(0),
      })
    ).toBe(TransferType.USER_OUT);
    expect(
      transferTypeFrom(false, SETTLEMENT_CONTRACT_ADDRESS, {
        from: SETTLEMENT_CONTRACT_ADDRESS,
        to: zeroAddress,
        amount: BigInt(0),
      })
    ).toBe(TransferType.AMM_OUT);
    expect(
      transferTypeFrom(false, SETTLEMENT_CONTRACT_ADDRESS, {
        to: SETTLEMENT_CONTRACT_ADDRESS,
        from: zeroAddress,
        amount: BigInt(0),
      })
    ).toBe(TransferType.AMM_IN);

    expect(
      transferTypeFrom(false, SETTLEMENT_CONTRACT_ADDRESS, {
        to: IRRELEVANT_ADDRESS,
        from: zeroAddress,
        amount: BigInt(0),
      })
    ).toBe(TransferType.IRRELEVANT);
  });
});

describe("classifyTransfers(transfers, tradeOwners)", () => {
  test("assigns correct TransferType for all input combinations", () => {
    const tradeOwners = new Set([USER_ADDRESS]);
    expect(
      classifyTransfer(
        {
          to: SETTLEMENT_CONTRACT_ADDRESS,
          from: USER_ADDRESS,
          amount: BigInt(0),
        },
        tradeOwners
      ).type
    ).toBe(TransferType.USER_IN);
    expect(
      classifyTransfer(
        {
          from: SETTLEMENT_CONTRACT_ADDRESS,
          to: USER_ADDRESS,
          amount: BigInt(0),
        },
        tradeOwners
      ).type
    ).toBe(TransferType.USER_OUT);
    expect(
      classifyTransfer(
        {
          to: SETTLEMENT_CONTRACT_ADDRESS,
          from: AMM_ADDRESS,
          amount: BigInt(0),
        },
        tradeOwners
      ).type
    ).toBe(TransferType.AMM_IN);
    expect(
      classifyTransfer(
        {
          from: SETTLEMENT_CONTRACT_ADDRESS,
          to: AMM_ADDRESS,
          amount: BigInt(0),
        },
        tradeOwners
      ).type
    ).toBe(TransferType.AMM_OUT);

    expect(
      classifyTransfer(
        {
          from: USER_ADDRESS,
          to: AMM_ADDRESS,
          amount: BigInt(0),
        },
        tradeOwners
      ).type
    ).toBe(TransferType.IRRELEVANT);
  });
});
