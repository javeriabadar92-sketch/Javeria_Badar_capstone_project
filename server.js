import express from 'express';
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

const SYSTEM_PROMPT = `You are ProjectPilot AI, an assistant that helps
Software Engineering students turn a project idea into a structured plan —
covering requirements, user stories, suggested features, and a development
roadmap.

Be concise, practical, and ask clarifying questions when the idea
is too vague to plan properly.`;

const PLAN_SYSTEM_PROMPT = `You are ProjectPilot AI's planning engine. Return ONLY valid JSON with no markdown fences, commentary, or extra keys. Use exactly this shape: {"overview":"string","requirements":{"functional":["string"],"nonFunctional":["string"]},"userStories":["string"],"suggestedFeatures":["string"],"roadmap":[{"phase":"string","description":"string"}],"kanbanTasks":[{"title":"string","status":"todo"}]}. Every kanban status must be exactly "todo", "inProgress", or "done". Make the plan specific, concise, and useful for a Software Engineering student.`;

const MODEL_NAME = 'gemini-flash-latest';

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode } = req.body;
    console.log('📥 Received chat request with', messages?.length || 0, 'messages');

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('❌ Missing API key!');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const modelMessages = await convertToModelMessages(messages ?? []);
    console.log('✅ Converted to model messages');

    const result = streamText({
      model: google(MODEL_NAME),
      system: mode === 'plan' ? PLAN_SYSTEM_PROMPT : SYSTEM_PROMPT,
      messages: modelMessages,
    });

    const response = result.toUIMessageStreamResponse();
    console.log('🚀 Starting stream response');

    res.status(response.status);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (!response.body) {
      throw new Error('No response body returned from AI SDK.');
    }

    const reader = response.body.getReader();
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('✅ Stream complete -', chunkCount, 'chunks sent');
        break;
      }

      chunkCount++;
      res.write(Buffer.from(value));
    }

    res.end();
  } catch (error) {
    console.error('Chat request failed:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Something went wrong while generating the response.',
      });
    } else {
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});