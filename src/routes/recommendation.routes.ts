import { Router } from "express"
import { getRecommendations } from "../controllers/recommendation.controller"

const router = Router()

router.get("/:userId", getRecommendations)

export default router