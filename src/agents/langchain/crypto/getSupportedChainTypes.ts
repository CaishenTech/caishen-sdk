import { Tool } from "langchain/tools";
import { CaishenSDK } from "../../../caishen";

export class CaishenCryptoGetSupportedChainTypesTool extends Tool {
  name = "crypto_get_supported_chain_types";
  description = `Fetch the list of supported chain types for creating wallets.

No input required.
`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(_input: string): Promise<string> {
    try {
      const chainTypes = await this.sdk.crypto.getSupportedChainTypes();

      return JSON.stringify({
        status: "success",
        chainTypes,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message || "Failed to get supported chain types",
        code: error.code || "CRYPTO_GET_SUPPORTED_CHAIN_TYPES_ERROR",
      });
    }
  }
}
