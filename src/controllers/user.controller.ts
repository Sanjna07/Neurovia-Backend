import { Request, Response } from "express"
import { prisma } from "../config/db"

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    })

    res.status(201).json(user)
  } catch (error: any) {
    console.error(error)

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" })
    }

    res.status(500).json({ error: error.message })
  }
}

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}