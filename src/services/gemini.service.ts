import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const generateQuizQuestions = async (skill: string) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  })

  const prompt = `
Generate 5 multiple choice questions for the skill: ${skill}.

Return ONLY valid JSON.

[
{
"text": "question",
"difficulty": "EASY",
"options": [
{"text": "option", "isCorrect": false},
{"text": "option", "isCorrect": false},
{"text": "option", "isCorrect": false},
{"text": "option", "isCorrect": true}
]
}
]
`

  const result = await model.generateContent(prompt)

  const responseText = result.response.text()

  return JSON.parse(responseText)
}