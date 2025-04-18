import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCryptoGetRPCTool extends Tool {
  name = "crypto_get_rpc";
  description = `Fetch the RPC endpoint for a given chain ID.

Input (JSON string):
- chainId: The chain ID for which you want the RPC endpoint (e.g., 1 for Ethereum).
`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);
      const { chainId } = parsedInput;

      if (!chainId) {
        throw new Error("chainId is required");
      }

      const rpcEndpoint = await this.sdk.crypto.getRPC(chainId);

      return JSON.stringify({
        status: "success",
        chainId,
        rpcEndpoint,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message || "Failed to get RPC endpoint",
        code: error.code || "CRYPTO_GET_RPC_ERROR",
      });
    }
  }
}