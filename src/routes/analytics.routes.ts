import { Router } from "express"
import { getUserSkillPerformance } from "../controllers/analytics.controller"

const router = Router()

router.get("/user/:userId", getUserSkillPerformance)

export default router