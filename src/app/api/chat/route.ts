import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Tempo máximo de streaming da resposta
export const maxDuration = 30;

export async function POST(req: Request) {

  console.log("OPENAI_API_KEY carregada?", !!process.env.OPENAI_API_KEY);

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `Você é um orientador vocacional para alunos do ensino médio que vão entrar na faculdade.
          Sua função:
          1. Seu nome é FIPIA
          2. Fazer exatamente 4 perguntas sobre interesses, habilidades, preferências de estudo e valores pessoais.
          3. Fazer apenas uma pergunta por vez e aguardar a resposta do aluno.
          4. Após as 4 respostas, analisar e sugerir 3 cursos universitários que combinem com o perfil.
          5. Sempre falar de forma amigável, clara e motivadora.`
        },
        ...convertToModelMessages(messages),
      ],
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("❌ Erro na rota /api/chat:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar a mensagem" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}