import { Request, Response } from "express"
import { prisma } from "../config/db"
import { QuizType } from "@prisma/client"
import { createInitialRoadmap, updateRoadmapProgress } from "../services/roadmap.service"

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

    const { userId, skillId, answers, type } = req.body

    if (!userId || !skillId) {
      return res.status(400).json({ error: "userId and skillId are required" })
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId }})
    const skillExists = await prisma.skill.findUnique({ where: { id: skillId }})

    if (!userExists || !skillExists) {
      return res.status(400).json({ error: "Invalid userId or skillId. They must exist in the database." })
    }

    let score = 0

    // Safely iterate over answers, ignoring invalid UUIDs
    if (Array.isArray(answers)) {
      for (const answer of answers) {
        if (!answer.optionId) continue;
        
        try {
          const option = await prisma.option.findUnique({
            where: { id: answer.optionId }
          })

          if (option?.isCorrect) {
            score++
          }
        } catch (e) {
          // Ignore Prisma crash for invalid UUID formats like "dummy_1"
        }
      }
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        skillId,
        score,
        total: Array.isArray(answers) ? answers.length : 0,
        type: type || QuizType.PRACTICE
      }
    })

    // Auto-trigger roadmap progression
    const totalAnswers = Array.isArray(answers) ? answers.length : 0;
    const percentage = totalAnswers > 0 ? (score / totalAnswers) * 100 : 0;
    
    prisma.skill.findUnique({ where: { id: skillId } }).then((skill) => {
      if (skill) {
        if (attempt.type === QuizType.INITIAL) {
          createInitialRoadmap(userId, skillId, skill.name, percentage).catch(console.error);
        } else {
          updateRoadmapProgress(userId, skillId, percentage).catch(console.error);
        }
      }
    }).catch(console.error);

    res.json({
      score,
      total: answers.length,
      attempt
    })

  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: "Quiz evaluation failed", details: error.message, stack: error.stack })
  }
}