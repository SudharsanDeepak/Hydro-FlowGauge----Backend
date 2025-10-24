import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { clerkMiddleware } from "@clerk/express"

dotenv.config()

import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import dataRoutes from "./routes/dataRoutes.js"
import mailRoutes from "./routes/mailRoutes.js"

const app = express()

connectDB()

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(clerkMiddleware())

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/data", dataRoutes)
app.use("/api/mail", mailRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})