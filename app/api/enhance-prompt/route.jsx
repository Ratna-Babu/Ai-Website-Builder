import { chatSession } from "@/configs/AiModel";

export async function POST(req) {
    const { prompt } = await req.json();
    
    // Instruction to the AI to transform a basic prompt into a professional, detailed one
    const enhancementPrompt = `Optimize the following user prompt for high-quality website code generation. 
    Make it detailed, specify layout preferences, and mention modern UI trends. 
    Return only the enhanced prompt text: "${prompt}"`;

    try {
        // Start a streaming session with the AI model
        const result = await chatSession.sendMessageStream(enhancementPrompt);
        
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let fullText = '';
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        fullText += chunkText;
                        
                        // Send individual chunks to the frontend for real-time updates
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`));
                    }
                    
                    // Signal completion and send the final combined text
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ enhancedPrompt: fullText, done: true })}\n\n`));
                    controller.close();
                } catch (e) {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message || 'Prompt enhancement failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}