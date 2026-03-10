import { Router } from "express"
import { registerUser, loginUser , oauthLogin} from "../controllers/user.controller"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/oauth", oauthLogin)

export default router