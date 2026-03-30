import { Router } from "express"
import { getRoadmap } from "../controllers/roadmap.controller"

const router = Router()

router.get("/:userId/:skillId", getRoadmap)

export default router
