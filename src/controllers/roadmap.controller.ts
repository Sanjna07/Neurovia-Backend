import { Request, Response } from "express"
import { prisma } from "../config/db"

export const getRoadmap = async (
  req: Request<{ userId: string, skillId: string }>,
  res: Response
) => {
  try {
    const { userId, skillId } = req.params

    const roadmap = await prisma.roadmap.findUnique({
      where: {
        userId_skillId: { userId, skillId }
      },
      include: {
        nodes: {
          orderBy: {
            order: 'asc'
          }
        },
        skill: true
      }
    })

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found for this skill yet." })
    }

    res.json(roadmap)
  } catch (error) {
    console.error("Roadmap Fetch Error:", error)
    res.status(500).json({ error: "Failed to fetch roadmap data." })
  }
}
