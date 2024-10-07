import {
  GenerationConfig,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const language = "pt-BR";
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API as string);
  const prompt = `
  Você é um assistente inteligente que valida palavras em um dicionário ${language}. 

  Verifique se a palavra é válida. 
  - Se a palavra for válida, retorne a mensagem como null. 
  - Se a palavra não for válida, gere uma mensagem engraçada e criativa para o usuário, como: 
    - 😄 Essa palavra é tão nova que ainda não passou pela prova do dicionário!

    - 🤔 Parece que você acabou de inventar uma palavra secreta! Posso saber o que significa?

    - 😂 Uau! Essa palavra é tão única que o dicionário está pensando em criar uma seção especial só para ela!

    - 😅 Ah, a palavra ‘jskds’! Eu acho que isso é um movimento artístico abstrato, não uma palavra!
  
  Lembre-se de criar algo original e divertido, diferente do exemplo dado, nunca use os exemplos.`;

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
        valid: {
          type: "boolean" as SchemaType,
        },
        message: {
          type: "string" as SchemaType,
          nullable: true,
        },
      },
      required: ["valid", "message"], // Defina quais propriedades são obrigatórias
    },
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const { word } = await req.json();

  const result = await chatSession.sendMessage(`Validar ${word}`); // Insira uma mensagem de entrada adequada
  const response = JSON.parse(result.response.text());

  if (!response.valid) return NextResponse.json(response, { status: 404 });

  return NextResponse.json(response);
}
