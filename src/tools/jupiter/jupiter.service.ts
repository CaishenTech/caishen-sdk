import { Tool } from "../core/decorators/Tool";
import { SolanaWalletClient } from "../core/wallets/solana/SolanaWalletClient";
import { createJupiterApiClient } from "@jup-ag/api";
import { VersionedTransaction } from "@solana/web3.js";
import { GetQuoteParameters } from "./parameters";

export class JupiterService {
    private readonly jupiterApiClient: ReturnType<typeof createJupiterApiClient>;

    constructor() {
        this.jupiterApiClient = createJupiterApiClient();
    }

    @Tool({
        name: "jupiter_get_quote",
        description: "Get a quote for a swap on the Jupiter DEX",
    })
    async getQuote(parameters: GetQuoteParameters) {
        try {
            const response = this.jupiterApiClient.quoteGet(parameters);
            return response;
        } catch (error: unknown) {
            if (error && typeof error === "object" && "response" in error) {
                const response = error.response as Response;

                const result = await response.json();
                throw new Error(`Failed to get quote: ${result.error}`);
            }
            throw error;
        }
    }

    @Tool({
        name: "jupiter_swap",
        description: "Swap an SPL token for another token on the Jupiter DEX",
    })
    async swapTokens(walletClient: SolanaWalletClient, parameters: GetQuoteParameters) {
        const quoteResponse = await this.getQuote(parameters);

        const { swapTransaction } = await this.jupiterApiClient.swapPost({
            swapRequest: {
                userPublicKey: walletClient.getAddress(),
                quoteResponse: quoteResponse,
                dynamicComputeUnitLimit: true,
                prioritizationFeeLamports: "auto",
            },
        });

        const versionedTransaction = VersionedTransaction.deserialize(Buffer.from(swapTransaction, "base64"));
        const instructions = await walletClient.decompileVersionedTransactionToInstructions(versionedTransaction);

        const { hash } = await walletClient.sendTransaction({
            instructions,
            addressLookupTableAddresses: versionedTransaction.message.addressTableLookups.map((lookup) =>
                lookup.accountKey.toBase58(),
            ),
        });

        return {
            hash,
        };
    }
}
