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

export const generateRoadmapTopics = async (skill: string, level: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  })

  const prompt = `
Generate an ordered list of 5 progressive learning topics for a ${level} level curriculum in ${skill}.

Return ONLY valid JSON.

[
{
"title": "Topic title",
"description": "Short explanation of what will be learned here"
}
]
`

  const result = await model.generateContent(prompt)

  const responseText = result.response.text()

  return JSON.parse(responseText)
}