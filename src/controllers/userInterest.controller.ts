import { Request, Response } from "express"
import { prisma } from "../config/db"

export const addUserInterest = async (req: Request, res: Response) => {
  try {
    const { userId, interestId, priority } = req.body

    if (!userId || !interestId || !priority) {
      return res.status(400).json({ error: "userId, interestId and priority required" })
    }

    const userInterest = await prisma.userInterest.create({
      data: {
        userId,
        interestId,
        priority
      }
    })

    res.status(201).json(userInterest)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const getUserInterests = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const interests = await prisma.userInterest.findMany({
      where: { userId },
      include: {
        interest: true
      }
    })

    res.json(interests)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}