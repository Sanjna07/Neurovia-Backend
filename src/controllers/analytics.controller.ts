import { Request, Response } from "express"
import { prisma } from "../config/db"

export const getUserSkillPerformance = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {

    const { userId } = req.params

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        skill: true
      }
    })

    if (attempts.length === 0) {
      return res.json({
        message: "No quiz attempts found for this user",
        data: []
      })
    }

    const analysis = attempts.map(a => ({
      skillId: a.skillId,
      skill: a.skill.name,
      score: a.score,
      total: a.total,
      percentage: Math.round((a.score / a.total) * 100),
      attemptDate: a.createdAt
    }))

    res.json({
      userId,
      skills: analysis
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch analytics" })
  }
}