import type { CaishenSDK } from '../caishen';
import {
  CashGetBalanceSchema,
  DepositCashSchema,
  SendTransactionSchema,
  WithdrawCashSchema,
} from '../cash/schema';
import {
  CryptoGetBalanceSchema,
  CryptoGetSwapRouteSchema,
  CryptoSendSchema,
  CryptoSwapSchema,
} from '../crypto/schema';
import { toolBase } from './core/classes/ToolBase';
import { ChainType } from '../constants';

export async function getToolsFromCaishen({ sdk }: { sdk: CaishenSDK }) {
  const tools = {
    cash_get_balance: toolBase({
      name: 'cash_get_balance',
      description: `Retrieve the cash balance of a specified account.

    Inputs (JSON string):
    - account: number (required) — the account number to fetch the balance for.
    `,
      parameters: CashGetBalanceSchema,
      execute: async (params) => {
        if (typeof params.account !== 'number') {
          throw new Error('account field must be a number');
        }
        return await sdk.cash.getBalance(params);
      },
    }),

    cash_deposit: toolBase({
      name: 'cash_deposit',
      description: `Deposit cash into your account using Caishen.

    Inputs (JSON string):
    - amount: string (required) — the amount to deposit
    - tokenAddress: string (required)- the token address
    - account: number (required) - account number
    `,
      parameters: DepositCashSchema,
      execute: async (params) => {
        if (!params.amount || !params.account || !params.tokenAddress) {
          throw new Error(
            'amount, account, and tokenAddress fields are required',
          );
        }
        return await sdk.cash.deposit(params);
      },
    }),

    cash_send: toolBase({
      name: 'cash_send',
      description: `Send cash to another account or destination using Caishen.

    Inputs (JSON string):
    - amount: string (required) — amount to send
    - toAddress: string (required)- another account or destination address
    - account: number (required) - account number
    `,
      parameters: SendTransactionSchema,
      execute: async (params) => {
        if (!params.amount || !params.account || !params.toAddress) {
          throw new Error('amount, account, and toAddress are required fields');
        }
        return await sdk.cash.send(params);
      },
    }),

    cash_withdraw: toolBase({
      name: 'cash_withdraw',
      description: `Withdraw cash from your Caishen account to a specified destination.

    Inputs (JSON string):
    - amount: string (required) — amount to withdraw
    - tokenAddress: string (required) — the token address
    - account: number (required) - account number
    `,
      parameters: WithdrawCashSchema,
      execute: async (params) => {
        if (!params.amount || !params.account || !params.tokenAddress) {
          throw new Error(
            'amount, account, and tokenAddress are required fields',
          );
        }
        return await sdk.cash.withdraw(params);
      },
    }),

    crypto_get_balance: toolBase({
      name: 'crypto_get_balance',
      description: `Get the crypto balance for a wallet address.
  
      Inputs (JSON string):
      - wallet: object
        - address: string (required)
        - chainType: string (required, e.g., "EVM", "SOLANA")
        - chainId: number (optional)
        - publicKey: string (optional)
        - account: number (optional)
      - payload: object
        - token: string (optional) — token address or symbol to check balance for (default is native token like ETH, SOL).

    Returns the balance as a string.`,
      parameters: CryptoGetBalanceSchema,
      execute: async (params) => {
        const wallet = {
          address: params.address,
          chainType: params.chainType,
          chainId: params.chainId,
          publicKey: params.publicKey,
          account: params.account,
        };
        const payload = {
          token: params.token,
        };

        if (!wallet || !wallet.address || !wallet.chainType) {
          throw new Error('wallet.address and wallet.chainType are required');
        }

        return await sdk.crypto.getBalance({
          wallet,
          payload,
        });
      },
    }),

    send_crypto: toolBase({
      name: 'send_crypto',
      description: `Send crypto from a wallet to another address.
  
      Inputs (JSON string):
      - wallet: object
        - address: string (required)
        - chainType: string (required, e.g., "EVM", "SOLANA")
        - chainId: number (optional)
        - publicKey: string (optional)
        - account: number (optional)
      - payload: object
        - toAddress: string (required) — recipient address
        - amount: string (required) — amount to send
        - token: string (optional) — token address or symbol (send gas token if not specified)
        - memo: number (optional) — transaction memo (for Solana, etc.)

    Returns the transaction signature as a string.`,
      parameters: CryptoSendSchema,
      execute: async (params) => {
        const wallet = {
          address: params.address,
          chainType: params.chainType,
          chainId: params.chainId,
          publicKey: params.publicKey,
          account: params.account,
        };
        const payload = {
          toAddress: params.toAddress,
          amount: params.amount,
          token: params.token,
          memo: params.memo,
        };

        if (!wallet || !wallet.address || !wallet.chainType) {
          throw new Error('wallet.address and wallet.chainType are required');
        }
        if (!payload || !payload.toAddress || !payload.amount) {
          throw new Error('payload.toAddress and payload.amount are required');
        }

        return await sdk.crypto.send({
          wallet,
          payload,
        });
      },
    }),

    swap_crypto: toolBase({
      name: 'swap_crypto',
      description: `Execute a crypto swap for a wallet after receiving a confirmation code.
  
    Inputs (JSON string):
    - wallet: object
      - account: number (required)
      - chainType: string (required, e.g., "EVM", "SOLANA")
    - payload: object
      - confirmationCode: string (required) — swap route confirmation code

    Returns the swap route output upon success.`,
      parameters: CryptoSwapSchema,
      execute: async (params) => {
        const wallet = {
          account: params.account,
          chainType: params.chainType,
        };
        const payload = {
          confirmationCode: params.confirmationCode,
        };

        if (!wallet || wallet.account === undefined || !wallet.chainType) {
          throw new Error('wallet.account and wallet.chainType are required');
        }
        if (!payload || !payload.confirmationCode) {
          throw new Error('payload.confirmationCode is required');
        }

        return await sdk.crypto.swap({
          wallet,
          payload,
        });
      },
    }),

    crypto_get_swap_route: toolBase({
      name: 'crypto_get_swap_route',
      description: `Get a swap route to exchange tokens between two chains or within the same chain.

      Inputs (JSON string):
      - wallet: object
        - account: number (required)
      - payload: object
        - amount: string (required) — amount to swap (in token units)
        - from: object (required)
          - tokenAddress: string (required)
          - chainType: string (required, e.g., "EVM", "SOLANA")
          - chainId: number (optional)
        - to: object (required)
          - tokenAddress: string (required)
          - chainType: string (required)
          - chainId: number (optional)

    Returns swap route data needed to later execute the swap.`,
      parameters: CryptoGetSwapRouteSchema,
      execute: async (params) => {
        const wallet = {
          account: params.account,
        };
        const payload = {
          amount: params.amount,
          from: {
            tokenAddress: params.fromAddress,
            chainType: ChainType[params.fromChainType as keyof typeof ChainType],
            chainId: params.fromChainId,
          },
          to: {
            tokenAddress: params.toAddress,
            chainType: ChainType[params.toChainType as keyof typeof ChainType],
            chainId: params.toChainId,
          },
        };

        if (!wallet || wallet.account === undefined) {
          throw new Error('wallet.account is required');
        }
        if (!payload || !payload.amount || !payload.from || !payload.to) {
          throw new Error(
            'payload.amount, payload.from, and payload.to are required',
          );
        }

        return await sdk.crypto.getSwapRoute({
          wallet,
          payload,
        });
      },
    }),
  };

  return tools;
}
