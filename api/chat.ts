export const config = {
  runtime: 'edge',
};

import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

const SYSTEM_PROMPT = `You are ProjectPilot AI, an assistant that helps 
Software Engineering students turn a project idea into a structured plan — 
covering requirements, user stories, suggested features, and a development 
roadmap. Be concise, practical, and ask clarifying questions when the idea 
is too vague to plan properly.`;

const MODEL_NAME = 'gemini-1.5-flash';

 export default async function handler(req: Request) {
  const { messages } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: google(MODEL_NAME),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}