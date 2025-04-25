import { PluginBase } from "../core/classes/PluginBase";
import { Chain } from "../core/types/Chain";
import { EVMWalletClient } from "../core/classes/EVMWalletClient";
import { BalanceService } from "./service";

export type OneInchCtorParams = {
    apiKey: string;
};

export class OneInchPlugin extends PluginBase<EVMWalletClient> {
    constructor(params: OneInchCtorParams) {
        super("1inch", [new BalanceService(params)]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm";
}

export function oneInch(params: OneInchCtorParams) {
    return new OneInchPlugin(params);
}
