import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getAllInterests = async (_: Request, res: Response) => {
  const interests = await prisma.interest.findMany();
  res.json(interests);
};

export const createInterest = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const interest = await prisma.interest.create({
      data: { name }
    });

    res.status(201).json(interest);

  } catch (error: any) {

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Interest already exists" });
    }

    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
