import { Tool } from "../core/decorators/Tool";
import { EVMWalletClient } from "../core/classes/EVMWalletClient";
import { GetBalancesParameters, SwapParameters } from "./parameters";
import { AggregatedBalancesAndAllowancesResponse, BalanceServiceParams } from "./types";

export class BalanceService {
    private readonly baseUrl: string;
    private readonly apiKey?: string;

    constructor(params: BalanceServiceParams = {}) {
        this.baseUrl = params.baseUrl ?? "https://api.1inch.dev";
        this.apiKey = params.apiKey;
    }
    // fetch('https://api.1inch.io/api/token_prices?base_token=ETH&quote_token=USDC')
    // .then(response => response.json())
    // .then(data => console.log(data));
    @Tool({
        name: "1inch_get_balances",
        description: "Get the balances of a wallet address on a specific chain",
    })
    async getAggregatedBalancesAndAllowances(
        walletClient: EVMWalletClient,
        parameters: GetBalancesParameters,
    ): Promise<AggregatedBalancesAndAllowancesResponse> {
        const { walletAddress } = parameters;
        const chainId = walletClient.getChain().id;

        const url = new URL(
            `${this.baseUrl}/balance/v1.2/${chainId}/balances/${walletAddress ?? walletClient.getAddress()}`,
        );

        const response = await fetch(url.toString(), {
            headers: {
                Accept: "application/json",
                ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch balances: ${response.statusText}`);
        }

        return await response.json();
    }

    @Tool({
        name: "1inch_swap",
        description: "swap from token A to token B",
    })
    async swap(
        walletClient: EVMWalletClient,
        parameters: SwapParameters,
    ): Promise<AggregatedBalancesAndAllowancesResponse> {
        const { fromTokenAddress, toTokenAddress, amount, slippage } = parameters;
        const chainId = walletClient.getChain().id;
        const walletAddress = walletClient.getAddress();
        const url = new URL(
            `${this.baseUrl}/swap/v5.2/${chainId}/swap`,
        );
        const requestBody = {
            fromTokenAddress: fromTokenAddress,
            toTokenAddress: toTokenAddress,
            amount: amount, // 1 ETH in wei
            fromAddress: walletAddress,
            slippage: slippage ?? 1,
            disableEstimate: true,
            allowPartialFill: false
          };
          
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Failed to swap: ${response.statusText}`);
        }

        return await response.json();
    }
}
