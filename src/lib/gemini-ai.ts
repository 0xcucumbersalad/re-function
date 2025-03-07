import { GoogleGenerativeAI, SchemaType, ObjectSchema } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Extract API keys from the given text. DO NOT ADD ANYTHING IF ITS NOT API KEY OR API TOKEN. Remove Google API keys if present.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object", // Instead of SchemaType.OBJECT, use string "object"
    properties: {
      error: { type: "boolean" },
      keys: {
        type: "array",
        items: {
          type: "object",
          properties: {
            key: { type: "string" },
          },
          required: ["key"],
        },
      },
    },
    required: ["error", "keys"],
  } as ObjectSchema, // Explicitly cast it as ObjectSchema
};

interface APIResponse {
  error: boolean;
  keys: { key: string }[];
}

export const getKeys = async (text: string[]): Promise<APIResponse> => {
  const chatSession = model.startChat({ generationConfig });

  const result = await chatSession.sendMessage(text);

  return JSON.parse(result.response.text()) as APIResponse;
};