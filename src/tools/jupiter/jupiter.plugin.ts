import { PluginBase } from "../core/classes";
import { type Chain } from "../core/types";
import { JupiterService } from "./jupiter.service";

export class JupiterPlugin extends PluginBase {
    constructor() {
        super("jupiter", [new JupiterService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "solana";
}

export const jupiter = () => new JupiterPlugin();
