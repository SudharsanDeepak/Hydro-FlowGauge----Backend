import express from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import dataRoutes from "./routes/dataRoutes.js"

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/data", dataRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))