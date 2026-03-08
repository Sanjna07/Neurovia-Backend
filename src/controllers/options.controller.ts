import { Request, Response } from "express"
import { prisma } from "../config/db"

export const createOption = async (req: Request, res: Response) => {
  try {
    const { text, isCorrect, questionId } = req.body

    if (!text || isCorrect === undefined || !questionId) {
      return res.status(400).json({
        error: "text, isCorrect and questionId are required"
      })
    }

    const option = await prisma.option.create({
      data: {
        text,
        isCorrect,
        questionId
      }
    })

    res.status(201).json(option)

  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}


export const getOptionsByQuestion = async (
  req: Request<{ questionId: string }>,
  res: Response
) => {
  try {
    const { questionId } = req.params

    const options = await prisma.option.findMany({
      where: { questionId }
    })

    res.json(options)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch options" })
  }
}