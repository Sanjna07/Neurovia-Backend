import { Router } from "express"
import { addUserInterest, getUserInterests } from "../controllers/userInterest.controller"

const router = Router()

router.post("/", addUserInterest)
router.get("/:userId", getUserInterests)

export default router