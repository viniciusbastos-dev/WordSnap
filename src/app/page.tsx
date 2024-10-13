import Header from "@/components/Header";
import InputGrid from "@/components/InputGrid";
import { createClient } from "@/utils/supabase/server";
import { isSameDay, parseISO } from "date-fns";

// TODO: criptografar palavra
export default async function Home() {
  const supabase = createClient();

  const { data } = await supabase.from("palavras").select("*");
  const wordOfDay = data?.find((item: { created_at: string }) =>
    isSameDay(parseISO(item.created_at), new Date())
  );
  const parsedWord = JSON.parse(wordOfDay?.word)?.word;

  return (
    <main className="h-screen pt-20 flex flex-col items-center gap-20">
      <Header />
      <InputGrid secretWord={parsedWord} />
    </main>
  );
}
