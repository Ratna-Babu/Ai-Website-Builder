import { NextResponse } from "next/server";
import { GenAiCode } from '@/configs/AiModel';

export async function POST(req) {
    const {prompt} = await req.json();
    try {
        const result = await GenAiCode.sendMessage(prompt);
        const resp = result.response.text();
        return NextResponse.json(JSON.parse(resp));
    } catch(e) {
        return NextResponse.json({error: e.message || 'Code generation failed'}, {status: 500});
    }
}