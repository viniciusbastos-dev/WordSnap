import {
  GenerationConfig,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const USED_WORDS_CACHE = ["rapaz", "fardo", "carro"];

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API as string);
  const prompt = `
  Você é meu assistente na construção de um jogo em que os usuários devem identificar palavras, similar ao jogo da forca. Siga as regras abaixo ao me fornecer as palavras:

    - As palavras devem ter exatamente 5 letras; se não tiverem, pense em outra palavra.
    - Forneça apenas uma palavra.
    - As palavras não podem conter caracteres especiais.
    - Antes de responder, conte os caracteres da palavra e garanta que ela tem 5 letras.
    - Não sugira as seguintes palavras: ${USED_WORDS_CACHE.join(", ")}.
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: prompt,
  });

  const generationConfig: GenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object" as SchemaType,
      properties: {
        word: {
          type: "string" as SchemaType,
          example: "word",
        },
      },
    },
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage("Palavra do dia"); // Insira uma mensagem de entrada adequada

  return NextResponse.json(JSON.parse(result.response.text()));
}
