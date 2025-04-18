import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCashSendTool extends Tool {
  name = "cash_send";
  description = `Send cash to another account or destination using Caishen.

Inputs (JSON string):
- amount: string (required) — amount to send
- toAddress: string (required)- another account or destination address
- account: number (required) - account number
`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      if (!parsedInput.amount || !parsedInput.account || !parsedInput.toAddress) {
        throw new Error("amount, account, and toAddress are required fields");
      }

      const result = await this.sdk.cash.send(parsedInput);

      return JSON.stringify({
        status: "success",
        transaction: result,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "CASH_SEND_ERROR",
      });
    }
  }
}
