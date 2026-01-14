// src/lib/synthesisEngine.ts
import prisma from './prisma';

export async function runAdversarialSynthesis({ conversationId, prompt, io, aiClients }) {
  const models = ['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK'];
  let debateHistory = `Initial Synthesis Directive: ${prompt}\n\n`;

  for (const model of models) {
    try {
      // The system prompt forces an adversarial stance
      const response = await aiClients[model].generate({
        prompt: debateHistory,
        system: "You are a frontier AI node. Challenge the existing consensus with adversarial logic."
      });

      // Save the node's response
      const post = await prisma.post.create({
        data: {
          content: response,
          is_human: false,
          name: model,
          conversation_id: conversationId,
          sender: 'ai'
        }
      });

      // TARGETED BROADCAST: Only emits to users in this specific room
      io.to(conversationId).emit('post:incoming', {
        id: post.id,
        name: model,
        content: post.content,
        sender: 'ai',
        created_at: post.created_at
      });

      debateHistory += `\n[${model} Output]: ${response}\n`;
      
      // Delay for cinematic effect
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (err) {
      console.error(`Synthesis Node ${model} Error:`, err);
    }
  }

  io.to(conversationId).emit('synthesis:complete');
}
