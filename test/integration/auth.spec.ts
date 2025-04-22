import 'dotenv/config';
import env from 'env-var';
import * as assert from 'assert';

import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { CaishenSDK, createAgentTools } from '../../src';
import { generateText } from 'ai';
import { createElevenLabsTools, createLangchainTools, createVercelAITools } from '../../src/adapters'
import { Tool } from 'ai';
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

  function castToToolRecord(obj: object): Record<string, Tool> {
    return obj as Record<string, Tool>;
  }

describe('Integration: SDK Authorization', function () {
  // async function execute({ text }) {
  //   const apiKey = process.env.ELEVENLABS_API_KEY!;
  //   console.log("apiKey: ", apiKey
  //   )
  //   const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID;
  //   const url = `https://api.elevenlabs.io/v1/text-to-speech/${defaultVoiceId}`;

  //   // const response = await fetch(url, {
  //   //   method: "POST",
  //   //   headers: {
  //   //     "Accept": "audio/mpeg",
  //   //     "Content-Type": "application/json",
  //   //     "xi-api-key": apiKey,
  //   //   },
  //   //   body: JSON.stringify({
  //   //     text,
  //   //     voice_settings: {
  //   //       stability: 0.7,
  //   //       similarity_boost: 0.7,
  //   //     },
  //   //   }),
  //   // });

  //   // if (!response.ok) {
  //   //   const error = await response.text();
  //   //   throw new Error(`ElevenLabs error: ${error}`);
  //   // }

  //   // const audioBuffer = await response.arrayBuffer();
  //   // // Save the audio file
  //   // await writeFile("output.mp3", Buffer.from(audioBuffer));
  //   // console.log("✅ Audio file saved as output.mp3!");
  //   const response = await generateText({
  //     model: openai('gpt-4o-mini'),
  //     prompt: 'Fetch balance for user account 789',
  //     tools: [],
  //   });
  //   // await generateText({

  //   // })
  //   // Return base64 encoded audio
  //   return {
  //     audioBase64: Buffer.from(audioBuffer).toString('base64'),
  //   };
  // };
  describe('Connect As User', () => {
    const sdk = new CaishenSDK({
      projectKey: env.get('PROJECT_KEY').required().asString(),
    });

    const provider = env.get('USER_PROVIDER').default('custom').asString();
    const token = env.get('USER_TOKEN').required().asString();

    // TODO: add more providers as list (not via env)
    it(`should connect as user (${provider} provider)`, async () => {
      const authToken = await sdk.connectAsUser({
        token,
        provider,
      });

      assert.strictEqual(
        typeof authToken,
        'string',
        'should return auth token',
      );
      // /// ================ elevenLabsData =============
      const elevenLabsData = await createElevenLabsTools({sdk})    
      const tools = castToToolRecord(elevenLabsData);
      const elevenLabs_input_text = "Hello, please give me the balance of account 15!";
      const elevenLabsData_result = await generateText({
        model: openai("gpt-4o-mini"),
        tools: tools,
        maxSteps: 10, 
        prompt: elevenLabs_input_text,
      });
      console.log("elevenLabs data result text: ", elevenLabsData_result.text);
      /// ================ vercelAIData =============
      const vercelAIData_text = "Hello, please give me the balance of account 15!";
      const vercelAIData = await createVercelAITools({sdk})  
      const vercelAIData_result = await generateText({
        model: openai("gpt-4o-mini"),
        tools: castToToolRecord(vercelAIData),
        maxSteps: 10, // Maximum number of tool invocations per request
        prompt: vercelAIData_text,
      });
      console.log("vercelAIData Result text: ", vercelAIData_result.text);
      console.log("\n-------------------\n");
      console.log("RESPONSE");
      console.log("\n-------------------\n");
      /// ================ langchainData =============
      const agent_tools = createAgentTools(sdk)
      const langchainData_text = "Fetch my cash balance account 12345";
      const langchainTools = await createLangchainTools({ sdk });
      const llm = new ChatOpenAI({
        temperature: 0,
        modelName: "gpt-4o-mini", // or "gpt-3.5-turbo", whatever you're using
      });
      const executor2 = await initializeAgentExecutorWithOptions(
        agent_tools,
        llm, // your model (OpenAI, Anthropic, etc)
        {
          agentType: "openai-functions",//"zero-shot-react-description",
          verbose: true,
        }
      );
      // now you can run
      const res = await executor2.call({ input: langchainData_text });
      console.log("res2 output: ", res.output);
      // const langchainData_text = "Fetch my cash balance account 12345";
      // const langchainTools = await createLangchainTools({ sdk });
      // const llm = new ChatOpenAI({
      //   temperature: 0,
      //   modelName: "gpt-4o-mini", // or "gpt-3.5-turbo", whatever you're using
      // });
      // const executor2 = await initializeAgentExecutorWithOptions(
      //   langchainTools,
      //   llm, // your model (OpenAI, Anthropic, etc)
      //   {
      //     agentType: "openai-functions",//"zero-shot-react-description",
      //     verbose: true,
      //   }
      // );
      // // now you can run
      // const res = await executor2.call({ input: "Fetch my cash balance account 12345" });
      // console.log("res2 output: ", res.output);

      // const DoubleNumberSchema = z.object({
      //   number: z.number().describe("The number to double"),
      // });
    
      // // 2. Create tool using Zod schema
      // const doubleNumberTool = tool(
      //   async (input) => {
      //     return `Double of ${input.number} is ${input.number * 2}`;
      //   },
      //   {
      //   name: "double_number",
      //   description: "Takes a number and returns its double",
      //   schema: DoubleNumberSchema,
      // });
      // // 2. Initialize model
      // const model = new ChatOpenAI({
      //   modelName: "gpt-4o-mini",
      //   temperature: 0,
      // });
    
      // // 3. Initialize agent
      // const executor = await initializeAgentExecutorWithOptions(
      //   [doubleNumberTool],
      //   model,
      //   {
      //     // agentType: "zero-shot-react-description",
      //     agentType: "openai-functions",
      //     verbose: true,
      //   }
      // );
    
      // console.log("Agent initialized.");
    
      // // 4. Run the agent with a prompt
      // const result = await executor.invoke({ input: "take number 5" });
      // console.log(result.output);
    });
  });

  describe('Connect As Agent', () => {
    const sdk = new CaishenSDK({
      projectKey: env.get('PROJECT_KEY').required().asString(),
    });

    it('should connect as agent', async () => {
      const authToken = await sdk.connectAsAgent({
        agentId: env.get('AGENT_ID').required().asString(),
      });

      assert.strictEqual(
        typeof authToken,
        'string',
        'should return auth token',
      );
    });
  });
});
