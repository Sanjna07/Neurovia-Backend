import { Router } from "express"
import { createSkill, getSkillsByInterest } from "../controllers/skills.controller"

const router = Router()

router.post("/", createSkill)
router.get("/:interestId", getSkillsByInterest)

export default router
