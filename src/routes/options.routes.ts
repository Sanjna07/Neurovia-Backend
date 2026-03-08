import { Router } from "express"
import { createOption, getOptionsByQuestion } from "../controllers/options.controller"

const router = Router()

router.post("/", createOption)

router.get("/:questionId", getOptionsByQuestion)

export default router
