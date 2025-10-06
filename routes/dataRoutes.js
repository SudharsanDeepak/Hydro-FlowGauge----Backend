import express from "express"
import protect from "../middleware/authMiddleware.js"
import { getFlowData } from "../controllers/dataController.js"

const router = express.Router()

router.get("/flow", protect, getFlowData)

export default router