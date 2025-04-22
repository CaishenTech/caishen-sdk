import { getToolsFromCaishen } from "../../tools/getToolsFromCaishen";
import { CaishenSDK } from "../../caishen";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export async function createElevenLabsTools({ sdk }: { sdk: CaishenSDK }) {
  const tools = await getToolsFromCaishen({ sdk });

  const elevenLabsTextToSpeech = new DynamicStructuredTool({
    name: "elevenlabs_tts",
    description: "Converts text to speech using ElevenLabs. Requires text and a voice ID.",
    func: async (input: { text: string; voice_id: string; model_id?: string }) => {
      if (!process.env.ELEVENLABS_API_KEY) {
        return "Error: ElevenLabs API key not configured.";
      }
      const { text, voice_id, model_id = "eleven_multilingual_v2" } = input;
  
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": process.env.ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text,
              model_id,
            }),
          }
        );
  
        if (!response.ok) {
          const error = await response.json();
          return `ElevenLabs API Error: ${response.status} - ${error?.detail?.message || response.statusText}`;
        }
  
        const audioBuffer = await response.arrayBuffer();
        const filename = `elevenlabs_output_${Date.now()}.mp3`;
        // await fs.writeFile(filename, Buffer.from(audioBuffer));
        return `Audio saved to ${filename}`; // Or you could return a base64 encoded string if needed
      } catch (error: any) {
        return `Error during ElevenLabs API call: ${error.message}`;
      }
    },
    schema: z.object({
      text: z.string().describe("The text to convert to speech."),
      voice_id: z.string().describe("The ID of the ElevenLabs voice to use."),
      model_id: z.string().optional().describe("Optional: The ID of the ElevenLabs model to use (default: eleven_multilingual_v2)."),
    }),
    returnDirect: true, // Or false depending on how you want the agent to handle the output
  });
  // const elevenLabTools: Record<string, (params: any) => Promise<any>> = {};

  // for (const tool of tools) {
  //   elevenLabTools[tool.name] = async (params: any) => {
  //     return await tool.execute(params);
  //   };
  // }
  // return elevenLabTools;
  return tools;
}
