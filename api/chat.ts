import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_GENERATIVE_AI_API_KEY?: string;
    }
  }
}

const SYSTEM_PROMPT = `You are ProjectPilot AI, an assistant that helps 
Software Engineering students turn a project idea into a structured plan — 
covering requirements, user stories, suggested features, and a development 
roadmap. Be concise, practical, and ask clarifying questions when the idea 
is too vague to plan properly.`;

const MODEL_NAME = 'Gemini 3.7 Flash';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable.',
        }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    const modelMessages = await convertToModelMessages(messages ?? []);

    const result = streamText({
      model: google(MODEL_NAME),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat request failed:', error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Something went wrong while generating the response.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}