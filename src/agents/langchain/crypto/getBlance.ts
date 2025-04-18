import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCryptoGetBalanceTool extends Tool {
  name = "crypto_get_balance";
  description = `Get the crypto balance for a wallet address.
  
  Inputs (JSON string):
  - wallet: object
    - address: string (required)
    - chainType: string (required, e.g., "EVM", "SOLANA")
    - chainId: number (optional)
    - publicKey: string (optional)
    - account: number (optional)
  - payload: object
    - token: string (optional) — token address or symbol to check balance for (default is native token like ETH, SOL).

Returns the balance as a string.`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      const wallet = parsedInput.wallet;
      const payload = parsedInput.payload || {};

      if (!wallet || !wallet.address || !wallet.chainType) {
        throw new Error("wallet.address and wallet.chainType are required");
      }

      const balance = await this.sdk.crypto.getBalance({
        wallet,
        payload,
      });

      return JSON.stringify({
        status: "success",
        balance,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "GET_BALANCE_ERROR",
      });
    }
  }
}
