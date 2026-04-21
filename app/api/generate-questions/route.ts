import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (ensure it's in your .env file)
const API_KEY = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

function validateQuestions(data: any) {
    if (!data.questions || !Array.isArray(data.questions)) return false;

    return data.questions.every((q: any) =>
        typeof q.question === "string" &&
        Array.isArray(q.answers) &&
        q.answers.length === 4 &&
        Array.isArray(q.correct) &&
        q.correct.every((idx: any) => typeof idx === "number" && idx >= 0 && idx < 4)
    );
}

export async function POST(request: NextRequest) {

    const body = await request.json() as { prompt: string, count: number };
    const count = body.count as number || 5;
    const prompt = body.prompt as string;

    const result = await model.generateContent(`You are generating trivia questions for a game.

Generate ${count} multiple choice questions based on this topic:
"${prompt}"

Rules:
- Each question must have exactly 4 answer choices
- Any number of correct answers
- The others must be clearly incorrect but plausible
- No trick questions
- Keep questions concise and clear

Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "question": "string",
      "answers": ["A", "B", "C", "D"],
      "correct": [0]
    }
  ]
}`);
    const response = result.response;
    if (validateQuestions(JSON.parse(response.text()))) {
        return new Response(response.text(), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify({ error: "Invalid question format from AI" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
}