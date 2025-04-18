import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCryptoSwapTool extends Tool {
  name = "swap_crypto";
  description = `Execute a crypto swap for a wallet after receiving a confirmation code.
  
  Inputs (JSON string):
  - wallet: object
    - account: number (required)
    - chainType: string (required, e.g., "EVM", "SOLANA")
  - payload: object
    - confirmationCode: string (required) — swap route confirmation code

Returns the swap route output upon success.`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      const wallet = parsedInput.wallet;
      const payload = parsedInput.payload;

      if (!wallet || wallet.account === undefined || !wallet.chainType) {
        throw new Error("wallet.account and wallet.chainType are required");
      }
      if (!payload || !payload.confirmationCode) {
        throw new Error("payload.confirmationCode is required");
      }

      const routeOutput = await this.sdk.crypto.swap({
        wallet,
        payload,
      });

      return JSON.stringify({
        status: "success",
        routeOutput,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "SWAP_CRYPTO_ERROR",
      });
    }
  }
}