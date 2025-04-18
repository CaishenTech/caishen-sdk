import type { CaishenSDK } from '../caishen';

import { 
    CaishenCashDepositTool,
    CaishenCashGetBalanceTool,
    CaishenCashSendTool,
    CaishenCashGetSupportedTokensTool,
    CaishenCashWithdrawTool,
    CaishenCryptoGetBalanceTool,
    CaishenCryptoGetWalletTool,
    CaishenCryptoGetSwapRouteTool,
    CaishenCryptoGetSupportedChainTypesTool,
    CaishenCryptoGetRPCTool,
    CaishenCryptoSendTool,
    CaishenCryptoSwapTool
} from "./langchain"

export function createAgentTools(sdk: CaishenSDK) {
    return [
      new CaishenCashDepositTool(sdk),
      new CaishenCashGetBalanceTool(sdk),
      new CaishenCashSendTool(sdk),
      new CaishenCashGetSupportedTokensTool(sdk),
      new CaishenCashWithdrawTool(sdk),
      new CaishenCryptoGetBalanceTool(sdk),
      new CaishenCryptoGetWalletTool(sdk),
      new CaishenCryptoGetSwapRouteTool(sdk),
      new CaishenCryptoSendTool(sdk),
      new CaishenCryptoSwapTool(sdk),
      new CaishenCryptoGetSupportedChainTypesTool(sdk),
      new CaishenCryptoGetRPCTool(sdk),
    ];
  }