export const config = {
  runtime: 'edge',
};

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

const PLAN_SYSTEM_PROMPT = `You are ProjectPilot AI's planning engine. Return ONLY valid JSON with no markdown fences, commentary, or extra keys. Use exactly this shape: {"overview":"string","requirements":{"functional":["string"],"nonFunctional":["string"]},"userStories":["string"],"suggestedFeatures":["string"],"roadmap":[{"phase":"string","description":"string"}],"kanbanTasks":[{"title":"string","status":"todo"}]}. Every kanban status must be exactly "todo", "inProgress", or "done". Make the plan specific, concise, and useful for a Software Engineering student.`;

const ACCEPTANCE_CRITERIA_SYSTEM_PROMPT = `You are ProjectPilot AI's acceptance criteria assistant. Return ONLY valid JSON with no markdown fences or extra keys. Use exactly this shape: {"acceptanceCriteria":["string"]}. Provide 3-4 specific, testable acceptance criteria bullet points for the user story provided.`;

const MODEL_NAME = 'gemini-2.5-flash';
const RATE_LIMIT_MESSAGE = "We've hit a temporary usage limit. Please wait a minute and try again.";

function getErrorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  try {
    return JSON.stringify(error);
  } catch {
    return '';
  }
}

function isRateLimitError(error: unknown): boolean {
  const text = getErrorText(error).toLowerCase();
  return text.includes('rate limit') || text.includes('quota') || text.includes('429') || text.includes('resource_exhausted');
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const { messages, mode } = await req.json();

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
      system: mode === 'plan'
        ? PLAN_SYSTEM_PROMPT
        : mode === 'acceptance-criteria'
          ? ACCEPTANCE_CRITERIA_SYSTEM_PROMPT
          : SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse({
      onError: (streamError) => isRateLimitError(streamError) ? RATE_LIMIT_MESSAGE : 'An error occurred.',
    });
  } catch (error) {
    console.error('Chat request failed:', error);

    return new Response(
      JSON.stringify({
        error: isRateLimitError(error)
          ? RATE_LIMIT_MESSAGE
          : error instanceof Error
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