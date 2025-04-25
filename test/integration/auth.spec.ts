import 'dotenv/config';
import env from 'env-var';
import * as assert from 'assert';

import { openai } from "@ai-sdk/openai";
import { CaishenSDK, createAgentTools } from '../../src';
import { generateText } from 'ai';
import { createElevenLabsTools, createLangchainTools, createVercelAITools } from '../../src/adapters'
import { Tool } from 'ai';
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

  function castToToolRecord(obj: object): Record<string, Tool> {
    return obj as Record<string, Tool>;
  }

describe('Integration: SDK Authorization', function () {
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
      const langchain_tools = createAgentTools(sdk)
      const langchainData_text = "Fetch my cash balance account 12345";
      // const langchainTools = await createLangchainTools({ sdk });
      const llm = new ChatOpenAI({
        temperature: 0,
        modelName: "gpt-4o-mini", // or "gpt-3.5-turbo", whatever you're using
      });
      const executor = await initializeAgentExecutorWithOptions(
        langchain_tools,
        llm, // your model (OpenAI, Anthropic, etc)
        {
          agentType: "openai-functions",//"zero-shot-react-description",
          verbose: true,
        }
      );
      // now you can run
      const res = await executor.call({ input: langchainData_text });
      console.log("langchain output: ", res.output);
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
