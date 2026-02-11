
export async function getEmbedding(text: string): Promise<number[]> {
  const MAX_CHARS = 8000;

  let finalText = text.length > MAX_CHARS
    ? text.substring(0, MAX_CHARS)
    : text;

  try {
    const res = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "jina-embeddings-v2-base-en",
        input: finalText
      })
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const json = await res.json();

    if (!json?.data?.[0]?.embedding) {
      throw new Error("Invalid embedding response from Jina");
    }

    return json.data[0].embedding;

  } catch (err) {
    console.error("Jina embedding failed:", err);
    throw err;
  }
}