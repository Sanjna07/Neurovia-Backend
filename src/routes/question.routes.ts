import { Router } from "express"
import {
  createQuestion,
  getQuestionsBySkill
} from "../controllers/question.controller"

const router = Router()

router.post("/", createQuestion)
router.get("/:skillId", getQuestionsBySkill)

export default router