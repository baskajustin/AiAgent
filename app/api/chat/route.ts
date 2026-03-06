import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Groq client (uses OpenAI SDK format)
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq('llama3-8b-8192'),
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      ...messages
    ]
  });

  return result.toTextStreamResponse();
}