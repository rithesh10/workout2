import { GoogleGenerativeAI } from '@google/generative-ai';
import { gemini_text } from './constant.js';
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
async function run(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: gemini_text});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();  // Await the Promise from response.text()
        return text;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;  // Optionally rethrow the error
    }
}
export { run };
