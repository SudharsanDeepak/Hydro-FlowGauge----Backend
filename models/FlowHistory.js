import mongoose from "mongoose"

const flowHistorySchema = new mongoose.Schema({
  userId: { 
    type: String,  // Changed to String for Clerk user IDs
    required: false  // Made optional since this is single-user system
  },
  flowRate: { 
    type: Number, 
    required: true 
  },
  valveStatus: { 
    type: String, 
    enum: ["OPEN", "CLOSED"],
    required: true 
  },
  event: { 
    type: String, 
    enum: ["NORMAL", "VALVE_CLOSED", "VALVE_OPEN", "LEAK_DETECTED"],
    default: "NORMAL"
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true })

flowHistorySchema.index({ timestamp: -1 })

export default mongoose.model("FlowHistory", flowHistorySchema)
