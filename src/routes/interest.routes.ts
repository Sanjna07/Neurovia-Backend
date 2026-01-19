import { Router } from "express";
import { getAllInterests, createInterest } from "../controllers/interest.controller";

const router = Router();

router.get("/", getAllInterests);
router.post("/", createInterest);

export default router;
