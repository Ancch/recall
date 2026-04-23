const OLLAMA_URL = "http://127.0.0.1:11434";

export async function getEmbedding(text: string): Promise<number[]> {
  const MAX_EMBEDDING_SIZE = 30000;

  let finalText = text;

  // ===== SUMMARIZATION (if long text) =====
  if (text.length > MAX_EMBEDDING_SIZE) {
    try {
      const summaryRes = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mistral",
          prompt: `Create a concise summary (under 5000 characters) that captures the essential meaning and key concepts of this text. Focus on the most important ideas only:\n\n${text.substring(0, 25000)}`,
          stream: false
        })
      });

      if (!summaryRes.ok) {
        throw new Error(await summaryRes.text());
      }

      const summaryJson = await summaryRes.json();
      const summarizedText = summaryJson.response?.trim();

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

  // ===== EMBEDDING =====
  try {
    const embedRes = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: finalText
      })
    });

    if (!embedRes.ok) {
      throw new Error(await embedRes.text());
    }

    const embedJson = await embedRes.json();

    if (!Array.isArray(embedJson.embedding)) {
      console.error("Invalid embedding response:", embedJson);
      throw new Error("Invalid embedding format");
    }

    return embedJson.embedding;

  } catch (err) {
    console.error("Embedding failed:", err);
    throw err;
  }
}