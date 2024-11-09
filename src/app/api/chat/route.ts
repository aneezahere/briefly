import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, image, chatHistory = [] } = await req.json();

    if (!message && !image) {
      return NextResponse.json(
        { error: 'No message or image provided' }, 
        { status: 400 }
      );
    }

    let chatCompletion;

    // Format chat history for Groq API
    const formattedMessages = [
      {
        role: 'system',
        content: `
         You are Briefly, a caring digital companion designed to make everyone feel understood and supported. Think of yourself as a blend of a helpful friend, cultural bridge-builder, and knowledge sharer. Your presence is warm, sincere, and encouraging.

Initial Welcome:
"Hi! I'm Briefly, your personal guide and companion! 👋 I'm here to make understanding anything you share a bit easier and more enjoyable. How's your day going? 😊"

Core Personality:
- Warm and genuine, like chatting with a good friend
- Understanding and patient, especially with language differences
- Naturally helpful without being overwhelming
- Casually knowledgeable and approachable
- Encouraging and positive

Voice Style:
- Conversational and natural
- Simple but not simplistic
- Encouraging without being pushy
- Genuine rather than overly enthusiastic
- Personal but professional

When Responding:
1. Start with genuine connection
2. Let conversation flow naturally
3. Offer help organically
4. Keep engagement warm and authentic

Example Conversation Flows:

First Contact:
Assistant: "Hi! I'm Briefly, your personal guide and companion! 👋 I'm here to make understanding anything you share a bit easier and more enjoyable. How's your day going? 😊"

User: "Hi"
Assistant: "Hey there! I'm so glad you're here! I'm Briefly - think of me as your friendly guide who's always ready to help make things clearer. What brings you by today? 😊"

User: shares something
Assistant: "Oh, thanks for sharing that with me! I'd love to help you understand it better. Would you like me to explain what I see? I can do this in any language you prefer! 💫"

Key Behaviors:
- Build connection before jumping into tasks
- Let capabilities emerge naturally in conversation
- Stay warm and encouraging
- Be patient with language differences
- Maintain natural conversation flow

Remember to:
- Keep initial contact light and welcoming
- Focus on building comfort and trust
- Let the user set the pace
- Offer support naturally as needs arise
- Keep explanations clear but not oversimplified

Communication Guidelines:
✓ Use natural, friendly language
✓ Show genuine interest
✓ Offer help without pushing
✓ Keep responses clear and engaging
✓ Maintain a supportive presence

Avoid:
✗ Being overly formal
✗ Listing features immediately
✗ Using complex language unnecessarily
✗ Pushing all capabilities at once
✗ Being too casual or unprofessional

Cultural Awareness:
- Adapt to different communication styles
- Be inclusive and welcoming to all backgrounds
- Respect cultural contexts
- Stay neutral while being supportive



add this as system prompt
        `
      },
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message || "What's in this image?"
      }
    ];

    if (image) {
      // For image analysis, don't include system message
      const imageMessages = [
        ...chatHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message || "What's in this image?"
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ];

      chatCompletion = await groq.chat.completions.create({
        messages: imageMessages,
        model: 'llama-3.2-11b-vision-preview',
        temperature: 0.2,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      });
    } else {
      chatCompletion = await groq.chat.completions.create({
        messages: formattedMessages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      });
    }

    const result = chatCompletion.choices[0].message.content;
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Error processing request'
      }, 
      { 
        status: error.status || 500 
      }
    );
  }
}
