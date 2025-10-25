import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {prompt} = await req.json();

    try {
        const result = await chatSession.sendMessage(prompt);
        const AIResp = result.response.text();

        return NextResponse.json({result: AIResp});
    } catch(e) {
        return NextResponse.json({error: e.message || 'AI chat failed'}, {status: 500});
    }
}