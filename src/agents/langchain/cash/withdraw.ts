import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCashWithdrawTool extends Tool {
  name = "cash_withdraw";
  description = `Withdraw cash from your Caishen account to a specified destination.

Inputs (JSON string):
- amount: string (required) — amount to withdraw
- tokenAddress: string (required) — the token address
- account: number (required) - account number
`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      if (!parsedInput.amount || !parsedInput.account || !parsedInput.tokenAddress) {
        throw new Error("amount, account, and tokenAddress are required fields");
      }

      const result = await this.sdk.cash.withdraw(parsedInput);

      return JSON.stringify({
        status: "success",
        transaction: result,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "CASH_WITHDRAW_ERROR",
      });
    }
  }
}