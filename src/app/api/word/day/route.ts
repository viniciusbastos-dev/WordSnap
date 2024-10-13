import { createClient } from "@/utils/supabase/server";
import {
  GenerationConfig,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { isSameDay, parseISO } from "date-fns";

export async function GET() {
  function generateRandomId() {
    return (Math.random() * 10000000000).toString(); // Gera um número aleatório
  }

  const randomId = generateRandomId();
  const supabase = createClient();

  const { data: getWordsData, error: getWordsError } = await supabase
    .from("palavras")
    .select("*");

  if (getWordsError) {
    return NextResponse.json(
      { message: getWordsError?.message },
      { status: 400 }
    );
  }

  const alreadyHaveWord = getWordsData?.some((item: { created_at: string }) =>
    isSameDay(parseISO(item.created_at), new Date())
  );

  if (alreadyHaveWord) {
    return NextResponse.json({ word: "Palavra do dia já foi gerada." });
  }

  const words = getWordsData?.map(
    (item: { word: string }): string => JSON.parse(item.word).word
  );
  const USED_WORDS_CACHE = words?.join(", ");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API as string);
  const prompt = `
  Você é meu assistente na construção de um jogo em que os usuários devem identificar palavras, similar ao jogo da forca. Siga as regras abaixo ao me fornecer as palavras:

    - As palavras devem ter exatamente 5 letras; se não tiverem, pense em outra palavra.
    - Forneça apenas uma palavra.
    - As palavras não podem conter caracteres especiais.
    - Antes de responder, conte os caracteres da palavra e garanta que ela tem 5 letras.
    - Não sugira as seguintes palavras: ${USED_WORDS_CACHE}.
    - O ID desta sessão é ${randomId}.
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

  const result = await chatSession.sendMessage(
    `Palavra do dia - ID: ${randomId}`
  );

  const wordOfDay = result.response.text();

  const { error } = await supabase
    .from("palavras")
    .insert([{ word: wordOfDay }]);

  if (error) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }

  return NextResponse.json({
    palavra: "A palavra do dia foi gerada com sucesso.",
  });
}
