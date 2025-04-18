import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCryptoSendTool extends Tool {
  name = "send_crypto";
  description = `Send crypto from a wallet to another address.
  
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

Returns the transaction signature as a string.`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      const wallet = parsedInput.wallet;
      const payload = parsedInput.payload;

      if (!wallet || !wallet.address || !wallet.chainType) {
        throw new Error("wallet.address and wallet.chainType are required");
      }
      if (!payload || !payload.toAddress || !payload.amount) {
        throw new Error("payload.toAddress and payload.amount are required");
      }

      const signature = await this.sdk.crypto.send({
        wallet,
        payload,
      });

      return JSON.stringify({
        status: "success",
        signature,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "SEND_CRYPTO_ERROR",
      });
    }
  }
}
