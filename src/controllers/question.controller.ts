import { Request, Response } from "express"
import { prisma } from "../config/db"
import { Difficulty } from "@prisma/client"

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { text, skillId, difficulty } = req.body as{
        text: string
        skillId: string
        difficulty: Difficulty
    }

    if (!text || !skillId || !difficulty) {
      return res.status(400).json({ error: "All fields required" })
    }

    if (!Object.values(Difficulty).includes(difficulty)) {
      return res.status(400).json({ error: "Invalid difficulty value" })
    }

    const question = await prisma.question.create({
      data: {
        text,
        skillId,
        difficulty
      }
    })

    res.status(201).json(question)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const getQuestionsBySkill = async (
  req: Request<{ skillId: string }>,
  res: Response
) => {
  try {
    const { skillId } = req.params

    const questions = await prisma.question.findMany({
      where: { skillId },
      include: { options: true }
    })

    res.json(questions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch questions" })
  }
}