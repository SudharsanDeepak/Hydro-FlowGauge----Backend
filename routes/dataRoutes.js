import express from "express"
import clerkAuth from "../middleware/hybridAuthMiddleware.js"
import { getFlowData, getFlowDataLite, controlValve, getHistory } from "../controllers/dataController.js"

const router = express.Router()

// Use Clerk authentication
router.get("/flow", clerkAuth, getFlowData)
router.get("/flow-lite", clerkAuth, getFlowDataLite)
router.post("/valve", clerkAuth, controlValve)
router.get("/history", clerkAuth, getHistory)

export default router