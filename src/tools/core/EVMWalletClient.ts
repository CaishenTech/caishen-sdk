import { type Signature, WalletClientBase } from "./index";
import type { EvmChain, EVMReadRequest, EVMReadResult, EVMTransaction, EVMTypedData } from "../core/types";

export abstract class EVMWalletClient extends WalletClientBase {
    abstract getChain(): EvmChain;
    abstract sendTransaction(transaction: EVMTransaction): Promise<{ hash: string }>;
    abstract read(request: EVMReadRequest): Promise<EVMReadResult>;
    abstract signTypedData(data: EVMTypedData): Promise<Signature>;
}
