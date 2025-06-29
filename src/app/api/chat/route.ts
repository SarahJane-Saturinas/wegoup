// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set');
      return NextResponse.json({ reply: '⚠️ Chat service is not configured.' }, { status: 500 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // a solid free model
        messages: [
          { role: "system", content: "You are a helpful plant care assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('OpenRouter API error:', errorText);
      return NextResponse.json({ reply: '⚠️ Chat service error.' }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenRouter error:', error);
    return NextResponse.json({ reply: '⚠️ Something went wrong.' }, { status: 500 });
  }
}
