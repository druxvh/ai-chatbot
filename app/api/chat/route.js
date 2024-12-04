import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { history, prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Error, ask a question!" }), {
        status: 400,
      });
    }
    const formattedHistory = history.map((item) => ({
      role: item.role,
      parts: [{ text: item.parts }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (error) {
    console.error("Error calling Google Generative AI:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch response from AI." }),
      { status: 500 }
    );
  }
}
