import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('OpenRouter test API error:', errorData);
      return NextResponse.json({ error: errorData.message || 'Failed to fetch models' }, { status: res.status });
    }

    const data = await res.json();
    console.log('OpenRouter test API success:', data);
    return NextResponse.json({ models: data.models });
  } catch (error) {
    console.error('OpenRouter test API error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
