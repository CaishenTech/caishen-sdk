import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCryptoGetWalletTool extends Tool {
  name = "crypto_get_wallet";
  description = `Get a crypto wallet for a specific chain and account.
  
  Inputs (JSON string):
  - chainType: string (required) — e.g., "EVM", "SOLANA", etc.
  - account: number (required) — account number
  - chainId: number (optional) — e.g., 1 for Ethereum Mainnet, 137 for Polygon, etc.
  
  Returns the wallet address, public key, and related information.`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      const wallet = await this.sdk.crypto.getWallet({
        chainType: parsedInput.chainType,
        chainId: parsedInput.chainId,
        account: parsedInput.account,
      });

      return JSON.stringify({
        status: "success",
        wallet,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "GET_WALLET_ERROR",
      });
    }
  }
}