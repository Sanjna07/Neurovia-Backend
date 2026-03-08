import { Request, Response } from "express"
import { prisma } from "../config/db"

export const getQuizBySkill = async (
  req: Request<{ skillId: string }>,
  res: Response
) => {
  try {
    const { skillId } = req.params

    const questions = await prisma.question.findMany({
      where: { skillId },
      take: 5,
      include: {
        options: {
          select: {
            id: true,
            text: true
          }
        }
      }
    })

    res.json({
      skillId,
      questions
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch quiz" })
  }
}

export const submitQuiz = async (req: Request, res: Response) => {
  try {

    const { answers } = req.body

    let score = 0

    for (const answer of answers) {
      const option = await prisma.option.findUnique({
        where: { id: answer.optionId }
      })

      if (option?.isCorrect) {
        score++
      }
    }

    res.json({
      totalQuestions: answers.length,
      score
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Quiz evaluation failed" })
  }
}