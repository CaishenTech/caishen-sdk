import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCashGetSupportedTokensTool extends Tool {
  name = "cash_get_supported_tokens";
  description = `Fetch the list of supported tokens for cash operations.

No input required.
`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(_input: string): Promise<string> {
    try {
      const tokens = await this.sdk.cash.getSupportedTokens();

      return JSON.stringify({
        status: "success",
        tokens,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "CASH_GET_SUPPORTED_TOKENS_ERROR",
      });
    }
  }
}
