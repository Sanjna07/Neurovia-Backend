import { Router } from "express"
import { getQuizBySkill, submitQuiz} from "../controllers/quiz.controller"

const router = Router()

router.get("/:skillId", getQuizBySkill)
router.post("/submit", submitQuiz)

export default router