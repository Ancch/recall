import Groq from "groq-sdk";

const JINA_API_URL = "https://api.jina.ai/v1/embeddings";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getEmbedding(text: string): Promise<number[]> {
  const MAX_EMBEDDING_SIZE = 30000;

  let finalText = text;

  // ===== SUMMARIZATION (if long text) =====
  if (text.length > MAX_EMBEDDING_SIZE) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Create a concise summary (under 5000 characters) that captures the essential meaning and key concepts of this text. Focus on the most important ideas only:\n\n${text.substring(0, 25000)}`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 2048,
      });

      const summarizedText = chatCompletion.choices[0]?.message?.content?.trim();

      if (summarizedText && summarizedText.length > 0) {
        finalText = summarizedText.substring(0, MAX_EMBEDDING_SIZE);
      } else {
        finalText = text.substring(0, MAX_EMBEDDING_SIZE);
      }

    } catch (err) {
      console.error("Summarization failed, using truncated text:", err);
      finalText = text.substring(0, MAX_EMBEDDING_SIZE);
    }
  }

  // ===== EMBEDDING (via Jina AI) =====
  try {
    const embedRes = await fetch(JINA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "jina-embeddings-v2-base-en",
        input: [finalText],
      }),
    });

    if (!embedRes.ok) {
      throw new Error(await embedRes.text());
    }

    const embedJson = await embedRes.json();

    if (!embedJson.data || !Array.isArray(embedJson.data[0]?.embedding)) {
      console.error("Invalid embedding response:", embedJson);
      throw new Error("Invalid embedding format");
    }

    return embedJson.data[0].embedding;

  } catch (err) {
    console.error("Embedding failed:", err);
    throw err;
  }
}