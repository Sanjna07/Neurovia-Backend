import { Request, Response } from "express"
import { prisma } from "../config/db"
import { searchLearningResources } from "../services/search.service"

export const getRecommendations = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: { skill: true }
    })

    if (!attempts.length) {
      return res.json({
        message: "User has not attempted any quizzes yet"
      })
    }

    const recommendations = []

    for (const attempt of attempts) {
      const percentage = Math.round((attempt.score / attempt.total) * 100)

      let level = "beginner"
      if (percentage >= 70) level = "advanced"
      else if (percentage >= 40) level = "intermediate"

      const resources = await searchLearningResources(
        attempt.skill.name,
        level
      )

      recommendations.push({
        skill: attempt.skill.name,
        score: percentage,
        level,
        resources
      })
    }

    res.json({
      userId,
      recommendations
    })
  } catch (error) {
    console.error("Recommendation error:", error)
    res.status(500).json({
      error: "Failed to generate recommendations"
    })
  }
}