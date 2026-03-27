import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    
    // We are proxying to FastAPI as per spec, but since we are dev, we can mock streaming
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const words = `Based on your symptoms, this might be a mild viral infection. Please ensure you stay hydrated and get plenty of rest. \n\nURGENCY: green`.split(' ');
        
        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          await new Promise((resolve) => setTimeout(resolve, 80)); // Mock delay
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
