import { Request, Response } from "express"
import { prisma } from "../config/db"
import { generateQuizQuestions } from "../services/gemini.service"

export const generateQuestionsForSkill = async (
  req: Request<{ skillId: string }>,
  res: Response
) => {
  try {
    const { skillId } = req.params

    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    })

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" })
    }

    const existing = await prisma.question.findFirst({
      where: { skillId }
    })

    if (existing) {
      return res.json({
        message: "Questions already exist for this skill"
      })
    }

    const aiQuestions = await generateQuizQuestions(skill.name)

    const savedQuestions = []

    for (const q of aiQuestions) {
      const question = await prisma.question.create({
        data: {
          text: q.text,
          difficulty: q.difficulty,
          skillId: skillId,
          options: {
            create: q.options
          }
        },
        include: { options: true }
      })

      savedQuestions.push(question)
    }

    res.json({
      message: "Questions generated and saved",
      questions: savedQuestions
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "AI generation failed" })
  }
}

