import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCashGetBalanceTool extends Tool {
  name = "cash_get_balance";
  description = `Retrieve the cash balance of a specified account.

Inputs (JSON string):
- account: number (required) — the account number to fetch the balance for.
`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      if (typeof parsedInput.account !== "number") {
        throw new Error("account field must be a number");
      }

      const result = await this.sdk.cash.getBalance(parsedInput);

      return JSON.stringify({
        status: "success",
        balance: result,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "CASH_GET_BALANCE_ERROR",
      });
    }
  }
}