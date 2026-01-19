import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getAllInterests = async (_: Request, res: Response) => {
  const interests = await prisma.interest.findMany();
  res.json(interests);
};

export const createInterest = async (req: Request, res: Response) => {
  const { name } = req.body;

  const interest = await prisma.interest.create({
    data: { name },
  });

  res.status(201).json(interest);
};
