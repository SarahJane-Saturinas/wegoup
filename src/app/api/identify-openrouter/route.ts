import { NextResponse } from 'next/server';

export async function POST(req: Request) {
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
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json({ error: errorData.message || 'Failed to identify plant' }, { status: res.status });
    }

    const data = await res.json();

    console.log('OpenRouter identify result:', data);

    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenRouter identify error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
