import { Tool } from "../core/decorators/Tool";
import { SolanaWalletClient } from "../core/wallets/solana";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createTransferCheckedInstruction,
    getAssociatedTokenAddressSync,
    getMint,
} from "@solana/spl-token";
import { PublicKey, type TransactionInstruction } from "@solana/web3.js";
import {
    ConvertToBaseUnitParameters,
    GetTokenBalanceByMintAddressParameters,
    GetTokenMintAddressBySymbolParameters,
    TransferTokenByMintAddressParameters,
} from "./parameters";
import { SPL_TOKENS, type SolanaNetwork, type Token } from "./tokens";
import type { SplTokenPluginCtorParams } from "./types/SplTokenPluginCtorParams";
import { doesAccountExist } from "./utils/doesAccountExist";

export class SplTokenService {
    private network: SolanaNetwork;
    private tokens: Token[];

    constructor({ network = "mainnet", tokens = SPL_TOKENS }: SplTokenPluginCtorParams = {}) {
        this.network = network;
        this.tokens = tokens;
    }

    @Tool({
        name: "get_spl_token_info",
        description: "Get the SPL token info by its symbol, including the mint address, decimals, and name",
    })
    async getTokenInfoBySymbol(parameters: GetTokenMintAddressBySymbolParameters) {
        const token = this.tokens.find((token) =>
            [token.symbol, token.symbol.toLowerCase()].includes(parameters.symbol),
        );
        return {
            symbol: token?.symbol,
            mintAddress: token?.mintAddresses[this.network],
            decimals: token?.decimals,
            name: token?.name,
        };
    }

    @Tool({
        name: "get_spl_balance",
        description: "Get the balance of an SPL token by its mint address",
    })
    async getTokenBalanceByMintAddress(
        walletClient: SolanaWalletClient,
        parameters: GetTokenBalanceByMintAddressParameters,
    ) {
        const { walletAddress, mintAddress } = parameters;
        try {
            const tokenAccount = getAssociatedTokenAddressSync(
                new PublicKey(mintAddress),
                new PublicKey(walletAddress),
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID,
            );

            const accountExists = await doesAccountExist(walletClient.getConnection(), tokenAccount);

            if (!accountExists) {
                return 0;
            }

            const balance = await walletClient.getConnection().getTokenAccountBalance(tokenAccount);

            return balance;
        } catch (error) {
            throw new Error(`Failed to get token balance: ${error}`);
        }
    }

    @Tool({
        name: "spl_transfer",
        description: "Transfer an SPL token by its mint address",
    })
    async transferTokenByMintAddress(
        walletClient: SolanaWalletClient,
        parameters: TransferTokenByMintAddressParameters,
    ) {
        const { to, mintAddress, amount } = parameters;

        const tokenMint = await getMint(walletClient.getConnection(), new PublicKey(mintAddress));

        if (!tokenMint) {
            throw new Error(`Token with mint address ${mintAddress} not found`);
        }

        const tokenMintPublicKey = new PublicKey(mintAddress);
        const fromPublicKey = new PublicKey(walletClient.getAddress());
        const toPublicKey = new PublicKey(to);

        const fromTokenAccount = getAssociatedTokenAddressSync(
            tokenMintPublicKey,
            fromPublicKey,
            true,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        const toTokenAccount = getAssociatedTokenAddressSync(
            tokenMintPublicKey,
            toPublicKey,
            true,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        const fromAccountExists = await doesAccountExist(walletClient.getConnection(), fromTokenAccount);
        const toAccountExists = await doesAccountExist(walletClient.getConnection(), toTokenAccount);

        if (!fromAccountExists) {
            throw new Error(`From account ${fromTokenAccount.toBase58()} does not exist`);
        }

        const instructions: TransactionInstruction[] = [];

        if (!toAccountExists) {
            instructions.push(
                createAssociatedTokenAccountInstruction(
                    fromPublicKey,
                    toTokenAccount,
                    toPublicKey,
                    tokenMintPublicKey,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                ),
            );
        }
        instructions.push(
            createTransferCheckedInstruction(
                fromTokenAccount,
                tokenMintPublicKey,
                toTokenAccount,
                fromPublicKey,
                BigInt(amount),
                tokenMint.decimals,
            ),
        );

        return await walletClient.sendTransaction({ instructions });
    }

    @Tool({
        name: "spl_convert",
        description: "Convert an amount of an SPL token to its base unit",
    })
    async convertToBaseUnit(parameters: ConvertToBaseUnitParameters) {
        const { amount, decimals } = parameters;
        const baseUnit = amount * 10 ** decimals;
        return baseUnit;
    }
}
