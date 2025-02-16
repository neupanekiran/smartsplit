import { NextRequest, NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const client = new Mistral({ apiKey });

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: message }],
    });

    const botMessage = response.choices[0].message.content;

    return NextResponse.json({ reply: botMessage }, { status: 200 });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
