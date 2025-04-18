import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCashDepositTool extends Tool {
  name = "cash_deposit";
  description = `Deposit cash into your account using Caishen.

Inputs (JSON string):
- amount: string (required) — the amount to deposit
- tokenAddress: string (required)- the token address
- account: number (required) - account number
`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      if (!parsedInput.amount || !parsedInput.account || !parsedInput.tokenAddress) {
        throw new Error("amount, account, and tokenAddress fields are required");
      }

      const result = await this.sdk.cash.deposit(parsedInput);

      return JSON.stringify({
        status: "success",
        transaction: result,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "CASH_DEPOSIT_ERROR",
      });
    }
  }
}