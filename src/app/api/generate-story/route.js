// /src/app/api/generate-story/route.js
import Groq from "groq-sdk";

const groq = new Groq();

export async function POST(req) {
  const { prompt } = await req.json(); // Get prompt from request body

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            prompt +
            "generate a story with proper starting and ending that helps childrens to learn about the topic with a beautiful story.",
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    // Return generated story as JSON response
    return new Response(
      JSON.stringify({
        story:
          chatCompletion.choices[0]?.message?.content || "Story not generated.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Error generating story" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
