import { Request, Response } from "express"
import { prisma } from "../config/db"

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, interestId } = req.body

    if (!name || !interestId) {
      return res.status(400).json({ error: "name and interestId required" })
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        interestId,
      },
    })

    res.status(201).json(skill)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create skill" })
  }
}

export const getSkillsByInterest = async (req: Request, res: Response) => {
  try {
    const { interestId } = req.params

    const skills = await prisma.skill.findMany({
      where: { interestId },
    })

    res.json(skills)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch skills" })
  }
}