import express from 'express';
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

const app = express();
app.use(express.json());

const SYSTEM_PROMPT = `You are ProjectPilot AI, an assistant that helps 
Software Engineering students turn a project idea into a structured plan — 
covering requirements, user stories, suggested features, and a development 
roadmap. Be concise, practical, and ask clarifying questions when the idea 
is too vague to plan properly.`;

const MODEL_NAME = 'gemini-1.5-flash';

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable.',
      });
    }

    const modelMessages = await convertToModelMessages(messages ?? []);

    const result = streamText({
      model: google(MODEL_NAME),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });

    // Stream the response
    const stream = result.toTextStream();
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ type: 'text-delta', text: chunk })}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat request failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Something went wrong while generating the response.',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
