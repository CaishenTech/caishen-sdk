// import 'dotenv/config';
// import env from 'env-var';
// import * as assert from 'assert';

// import { openai } from "@ai-sdk/openai";
// import { CaishenSDK, createAgentTools } from '../../src';
// import { generateText } from 'ai';
// import { createElevenLabsTools, createLangchainTools, createVercelAITools } from '../../src/adapters'
// import { Tool } from 'ai';
// import { ChatOpenAI } from "@langchain/openai";
// import { http } from "viem";
// import { createWalletClient } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
// import { baseSepolia } from "viem/chains";
// import { viem } from "../../src/tools/core/wallets/viem";
// import { getOnChainTools } from "../../src/adapters/getAITools";
// import { balancer } from "../../src/tools/balancer"

// describe('balancer tool Integration:', function () {
//   describe('token swap', async () => {
//     const rpc_provider = env.get('RPC_PROVIDER_URL').required().asString();
//     const privateKey = env.get('WALLET_PRIVATE_KEY').required().asString();
//     // 1. Create a wallet client
//     const account = privateKeyToAccount(privateKey as `0x${string}`);

//     const walletClient = createWalletClient({
//         account: account,
//         transport: http(rpc_provider),
//         chain: baseSepolia,
//     });
//     console.log("walletClient: ", await walletClient.getAddresses());
//     (async () => {
//       // 2. Get your onchain tools for your wallet
//       const tools = await getOnChainTools({
//           wallet: viem(walletClient),
//           plugins: [
//             balancer({
//                 rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
//            })
//           ],
//       });
//       const prompt = "please swap USDC and PEPE from account 0";
//       try {
//         const result = await generateText({
//             model: openai("gpt-4o-mini"),
//             tools: tools,
//             maxSteps: 10, // Maximum number of tool invocations per request
//             prompt: prompt,
//             onStepFinish: (event) => {
//                 console.log(event.toolResults);
//             },
//         });
//         console.log("\n-------------------\n");
//         console.log("RESPONSE");
//         console.log("\n-------------------\n");
//         console.log(result.text);
//         } catch (error) {
//             console.error(error);
//         }
//         console.log("\n-------------------\n");
//     })();
//   });

//   describe('add liquidity', async () => {
//     const rpc_provider = env.get('RPC_PROVIDER_URL').required().asString();
//     const privateKey = env.get('WALLET_PRIVATE_KEY').required().asString();
//     // 1. Create a wallet client
//     const account = privateKeyToAccount(privateKey as `0x${string}`);

//     const walletClient = createWalletClient({
//         account: account,
//         transport: http(rpc_provider),
//         chain: baseSepolia,
//     });
//     console.log("walletClient: ", await walletClient.getAddresses());
//     (async () => {
//       // 2. Get your onchain tools for your wallet
//       const tools = await getOnChainTools({
//           wallet: viem(walletClient),
//           plugins: [
//             balancer({
//                 rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
//            })
//           ],
//       });
//       const prompt = "please remove PEPE-USDC liquidity from pool";
//       try {
//         const result = await generateText({
//             model: openai("gpt-4o-mini"),
//             tools: tools,
//             maxSteps: 10, // Maximum number of tool invocations per request
//             prompt: prompt,
//             onStepFinish: (event) => {
//                 console.log(event.toolResults);
//             },
//         });
//         console.log("\n-------------------\n");
//         console.log("RESPONSE");
//         console.log("\n-------------------\n");
//         console.log(result.text);
//         } catch (error) {
//             console.error(error);
//         }
//         console.log("\n-------------------\n");
//     })();
//   });


//   describe('remove liquidity', async () => {
//     const rpc_provider = env.get('RPC_PROVIDER_URL').required().asString();
//     const privateKey = env.get('WALLET_PRIVATE_KEY').required().asString();
//     // 1. Create a wallet client
//     const account = privateKeyToAccount(privateKey as `0x${string}`);

//     const walletClient = createWalletClient({
//         account: account,
//         transport: http(rpc_provider),
//         chain: baseSepolia,
//     });
//     console.log("walletClient: ", await walletClient.getAddresses());
//     (async () => {
//       // 2. Get your onchain tools for your wallet
//       const tools = await getOnChainTools({
//           wallet: viem(walletClient),
//           plugins: [
//             balancer({
//                 rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
//            })
//           ],
//       });
//       const prompt = "please swap USDC and PEPE from account 0";
//       try {
//         const result = await generateText({
//             model: openai("gpt-4o-mini"),
//             tools: tools,
//             maxSteps: 10, // Maximum number of tool invocations per request
//             prompt: prompt,
//             onStepFinish: (event) => {
//                 console.log(event.toolResults);
//             },
//         });
//         console.log("\n-------------------\n");
//         console.log("RESPONSE");
//         console.log("\n-------------------\n");
//         console.log(result.text);
//         } catch (error) {
//             console.error(error);
//         }
//         console.log("\n-------------------\n");
//     })();
//   });
// });
