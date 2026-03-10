import { Request, Response  } from "express"
import { prisma } from "../config/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = async (req: Request, res: Response) => {

  const { email, password, name } = req.body

  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    return res.status(400).json({ error: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      provider: "email"
    }
  })

  res.json(user)
}

export const loginUser = async (req: Request, res: Response) => {

  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || !user.password) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

  res.json({ token, user })
}

export const oauthLogin = async (req: Request, res: Response) => {

  const { email, name, provider, providerId } = req.body

  let user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {

    user = await prisma.user.create({
      data: {
        email,
        name,
        provider,
        providerId
      }
    })

  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

  res.json({ token, user })
}