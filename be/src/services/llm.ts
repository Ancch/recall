const OLLAMA_URL = "http://127.0.0.1:11434";

export async function generateText(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",   
      prompt,
      stream: false
    })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const json = await res.json();
  return json.response?.trim() || "";
}