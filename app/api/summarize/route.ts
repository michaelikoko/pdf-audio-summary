// api/summarize/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const geminiAI = new GoogleGenAI({});

const lengthMap = {
    short: "2-3 concise paragraphs",
    medium: "4-6 well-structured paragraphs",
    long: "a detailed, comprehensive summary with 8 or more paragraphs"
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const summaryLength = (formData.get("summaryLength") || "medium") as keyof typeof lengthMap;
        const customPrompt = formData.get("customPrompt") as string;

        const bytes = await file.arrayBuffer();
        const fileBase64 = Buffer.from(bytes).toString('base64');

        let prompt = `Summarize the following document in ${lengthMap[summaryLength]} using clear, plain English.
Focus on the main points, key arguments, and important details.
Format your response with proper paragraphs and structure.`;

        if (customPrompt) {
            prompt += `\n\nAdditional instructions: ${customPrompt}`;
        }

        const contents = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: file.type,
                    data: fileBase64,
                }
            }
        ];

        const response = await geminiAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
        });

        return NextResponse.json({
            message: response.text,
            wordCount: response.text ? response.text.split(' ').length : 0,
        });
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json(
            { error: 'Failed to summarize document' },
            { status: 500 }
        );
    }
}