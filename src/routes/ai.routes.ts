import { Router } from "express"
import { generateQuestionsForSkill } from "../controllers/ai.controller"

const router = Router()

router.get("/generate/:skillId", generateQuestionsForSkill)

export default router