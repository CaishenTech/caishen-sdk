import { type Signature, WalletClientBase } from "../../classes";
import { type EvmChain } from "../../types";
import type { EVMReadRequest, EVMReadResult, EVMTransaction, EVMTypedData } from "./types";

export abstract class EVMWalletClient extends WalletClientBase {
    abstract getChain(): EvmChain;
    abstract sendTransaction(transaction: EVMTransaction): Promise<{ hash: string }>;
    abstract read(request: EVMReadRequest): Promise<EVMReadResult>;
    abstract signTypedData(data: EVMTypedData): Promise<Signature>;
}
