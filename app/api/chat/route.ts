'API'
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
export const runtime = 'edge';
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [{ role: 'system', content: 'You are a helpful AI assistant.' }, ...messages]
  });
  return result.toDataStreamResponse();
}
API