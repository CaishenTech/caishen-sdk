import { createToolParameters } from "../core/utils/createToolParameters";
import { z } from "zod";

export class GetBalancesParameters extends createToolParameters(
    z.object({
        walletAddress: z.string().optional().describe("The wallet address to check balances for"),
    }),
) {}

export class SwapParameters extends createToolParameters(
    z.object({
        fromTokenAddress: z.string().optional().describe("fromTokenAddress"),
        toTokenAddress: z.string().optional().describe("toTokenAddress"),
        amount: z.string().describe("token amount"),
        slippage: z.number().optional().describe("slippage amount"),
    }),
) {}