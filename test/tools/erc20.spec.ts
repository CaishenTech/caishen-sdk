import 'dotenv/config';
import env from 'env-var';
import * as assert from 'assert';

import { openai } from "@ai-sdk/openai";
import { generateText } from 'ai';
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { viem } from "../../src/tools/core/wallets/viem";
import { sendETH } from "../../src/tools/core/wallets/evm";
import { getOnChainTools } from "../../src/adapters/getAITools";
import { PEPE, USDC, erc20 } from "../../src/tools/erc20";

describe('erc20 tool Integration:', function () {
  describe('get balance', async () => {
    const rpc_provider = env.get('RPC_PROVIDER_URL').required().asString();
    const privateKey = env.get('WALLET_PRIVATE_KEY').required().asString();
    // 1. Create a wallet client
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const walletClient = createWalletClient({
        account: account,
        transport: http(rpc_provider),
        chain: baseSepolia,
    });
    console.log("walletClient: ", await walletClient.getAddresses());
    (async () => {
      // 2. Get your onchain tools for your wallet
      const tools = await getOnChainTools({
          wallet: viem(walletClient),
          plugins: [
              sendETH(), // Enable ETH transfers
              erc20({ tokens: [USDC, PEPE] }), // Enable ERC20 token operations
          ],
      });
      const prompt = "please give me my ETH Balance"
      // const prompt = "please give me my balance of USDC and PEPE";
      try {
        const result = await generateText({
            model: openai("gpt-4o-mini"),
            tools: tools,
            maxSteps: 10, // Maximum number of tool invocations per request
            prompt: prompt,
        });
        console.log("\n-------------------\n");
        console.log("RESPONSE");
        console.log("\n-------------------\n");
        console.log(result.text);
        } catch (error) {
            console.error(error);
        }
        console.log("\n-------------------\n");
    })();
  });

  describe('total supply', async () => {
    const rpc_provider = env.get('RPC_PROVIDER_URL').required().asString();
    const privateKey = env.get('WALLET_PRIVATE_KEY').required().asString();
    // 1. Create a wallet client
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const walletClient = createWalletClient({
        account: account,
        transport: http(rpc_provider),
        chain: baseSepolia,
    });
    console.log("walletClient: ", await walletClient.getAddresses());
    (async () => {
      // 2. Get your onchain tools for your wallet
      const tools = await getOnChainTools({
          wallet: viem(walletClient),
          plugins: [
              sendETH(), // Enable ETH transfers
              erc20({ tokens: [USDC, PEPE] }), // Enable ERC20 token operations
          ],
      });
      const prompt = "please give me total supply of ETH and USDC"
      try {
        const result = await generateText({
            model: openai("gpt-4o-mini"),
            tools: tools,
            maxSteps: 10, // Maximum number of tool invocations per request
            prompt: prompt,
        });
        console.log("\n-------------------\n");
        console.log("RESPONSE");
        console.log("\n-------------------\n");
        console.log(result.text);
        } catch (error) {
            console.error(error);
        }
        console.log("\n-------------------\n");
    })();
  });
});
