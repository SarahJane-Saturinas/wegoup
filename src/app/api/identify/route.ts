import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const description = body.description;

    if (!description || description.trim() === '') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a helpful plant identification assistant." },
          { role: "user", content: `Identify this plant based on the description:\n\n${description}` }
        ]
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || 'Failed to identify plant' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenRouter identify error:', error);
    return NextResponse.json({ error: 'Failed to identify plant' }, { status: 500 });
  }
}
