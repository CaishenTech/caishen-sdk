import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCryptoGetSwapRouteTool extends Tool {
  name = "crypto_get_swap_route";
  description = `Get a swap route to exchange tokens between two chains or within the same chain.

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

Returns swap route data needed to later execute the swap.`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      const wallet = parsedInput.wallet;
      const payload = parsedInput.payload;

      if (!wallet || wallet.account === undefined) {
        throw new Error("wallet.account is required");
      }
      if (!payload || !payload.amount || !payload.from || !payload.to) {
        throw new Error("payload.amount, payload.from, and payload.to are required");
      }

      const routeOutput = await this.sdk.crypto.getSwapRoute({
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
        code: error.code || "GET_SWAP_ROUTE_ERROR",
      });
    }
  }
}