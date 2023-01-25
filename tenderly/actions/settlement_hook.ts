import {
  ActionFn,
  Context,
  Event,
  TransactionEvent,
  Log,
} from "@tenderly/actions";
import { insertSettlementEvent } from "./src/database";

export const SETTLEMENT_CONTRACT_ADDRESS =
  "0x9008d19f58aabd9ed0d60971565aa8510560ab41";
export const SETTLEMENT_EVENT_TOPIC =
  "0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4";
export const TRANSFER_EVENT_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
export const TRADE_EVENT_TOPIC =
  "0xa07a543ab8a018198e99ca0184c93fe9050a79400a0a723441f84de1d972cc17";
export enum TransferType {
  AMM_IN,
  AMM_OUT,
  USER_IN,
  USER_OUT,
  IRRELEVANT,
}

export interface SettlementTransfer {
  amount: BigInt;
  to: string;
  from: string;
  type: TransferType;
}

export interface TradeEvent {
  // The only relevant field for our purposes at this time.
  owner: string;
}

export interface TransferEvent {
  to: string;
  from: string;
  amount: BigInt;
}

export interface SettlementEvent {
  solver: string;
}

export interface ClassifiedEvents {
  trades: TradeEvent[];
  transfers: TransferEvent[];
  settlements: SettlementEvent[];
}

export interface TransactionData {
  hash: string;
  solver: string;
  transfers: SettlementTransfer[];
}
export const triggerInternalTransfersPipeline: ActionFn = async (
  context: Context,
  event: Event
) => {
  const parsedData = settlementEventHandler(event);
  // TODO 1 - Trigger AWS Lambda.
  const dbUrl = await context.secrets.get("DATABASE_URL");
  // TODO 2 - Write (TxHash, Solver) directly to DB.
  await insertSettlementEvent(dbUrl, parsedData.hash, parsedData.solver);
};

export function settlementEventHandler(event: Event): TransactionData {
  const transactionEvent = event as TransactionEvent;
  const txHash = transactionEvent.hash;
  const { trades, transfers, settlements } = partitionEventLogs(
    transactionEvent.logs
  );
  if (settlements.length > 1) {
    console.error(`Two settlements in same batch ${txHash}!`);
  }

  console.log(`Parsed ${transfers.length} (relevant) transfer events`);
  console.log(`Parsed ${trades.length} trade events`);

  const settlementTransfers = transfers.map((transfer) =>
    classifyTransfer(transfer, new Set(trades.map((t) => t.owner)))
  );
  return {
    hash: txHash,
    solver: settlements[0].solver,
    transfers: settlementTransfers,
  };
}
export function transferTypeFrom(
  isUser: boolean,
  referenceAddress: string,
  transfer: TransferEvent
): TransferType {
  if (![transfer.to, transfer.from].includes(referenceAddress)) {
    console.warn(
      `expected irrelevant transfers to be filtered out already: ${transfer}`
    );
    return TransferType.IRRELEVANT;
  }
  const isIncoming = transfer.to === SETTLEMENT_CONTRACT_ADDRESS;
  if (isUser) {
    return isIncoming ? TransferType.USER_IN : TransferType.USER_OUT;
  }
  return isIncoming ? TransferType.AMM_IN : TransferType.AMM_OUT;
}

export function partitionEventLogs(logs: Log[]): ClassifiedEvents {
  let result: ClassifiedEvents = {
    transfers: [],
    trades: [],
    settlements: [],
  };
  while (logs.length > 0) {
    const log = logs.pop();
    const topics = log?.topics;
    if (!topics) {
      break;
    }
    const eventTopic = topics[0];

    if (eventTopic === TRANSFER_EVENT_TOPIC) {
      const from = addressFromBytes(topics[1]);
      const to = addressFromBytes(topics[2]);
      if ([to, from].includes(SETTLEMENT_CONTRACT_ADDRESS)) {
        result.transfers.push({
          to: to,
          from: from,
          // TODO - parse U256 here
          amount: BigInt(log?.data),
        });
      }
    } else if (eventTopic === TRADE_EVENT_TOPIC) {
      result.trades.push({
        owner: addressFromBytes(topics[1]),
      });
    } else if (eventTopic === SETTLEMENT_EVENT_TOPIC) {
      result.settlements.push({
        solver: addressFromBytes(topics[1]),
      });
    } else {
      // Other, currently ignored, event topic.
    }
  }
  return result;
}

export function classifyTransfer(
  transfer: TransferEvent,
  tradeOwners: Set<string>
): SettlementTransfer {
  const isUser = tradeOwners.has(transfer.to) || tradeOwners.has(transfer.from);
  return {
    to: transfer.to,
    from: transfer.from,
    amount: transfer.amount,
    type: transferTypeFrom(isUser, SETTLEMENT_CONTRACT_ADDRESS, transfer),
  };
}
export function addressFromBytes(hexStr: string): string {
  return "0x" + hexStr.slice(-40);
}
