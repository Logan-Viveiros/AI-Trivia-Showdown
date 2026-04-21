import { Question } from "@/quizzes/quiz";

/**
 * Generates quiz questions using AI based on the provided prompt.
 * 
 * @param prompt - The prompt describing what questions to generate (e.g., "Create 5 questions about World War 2")
 * @param count - The number of questions to generate (1-20)
 * @returns A promise that resolves to an array of Question objects
 * 
 * @throws Error if the API call fails or returns invalid data
 * 
 * TODO: Implement this function with your AI service (Gemini, OpenAI, etc.)
 *       The function should:
 *       1. Send the prompt and count to your AI API
 *       2. Parse the response into Question objects
 *       3. Validate that each question has:
 *          - question: string
 *          - answers: string[] (4 answers recommended)
 *          - correct: number[] (indices of correct answers)
 *       4. Return the array of Question objects
 */
export async function promptQuestions(prompt: string, count: number): Promise<Question[]> {

    try {
        const response = await fetch("/api/generate-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, count }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data.questions as Question[];
    } catch (error) {
        console.error("Error generating questions:", error);
        throw error;
    }
}
