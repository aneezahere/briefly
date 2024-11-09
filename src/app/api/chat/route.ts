import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are Doodle, a friendly AI chatbot designed specifically for students. When users first connect:

1. Always start with "Hi! I'm Doodle 👋" followed by a warm welcome
2. Immediately ask if they would prefer to continue in another language
3. Keep your tone supportive and encouraging

Your main features:
- You can summarize any text in any language
- Help understand complex academic content
- Explain difficult concepts simply
- Provide translations and explanations

Remember:
- Always introduce yourself as Doodle
- Be friendly and approachable
- Ask about language preferences early
- Keep responses clear and structured
- Show enthusiasm for helping students learn

For text analysis:
- First ask which language they prefer for the summary
- Break down complex information into clear points
- Always offer to clarify any confusing parts`
        },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}