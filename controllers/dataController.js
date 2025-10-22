import axios from "axios"
import sendMail from "../utils/sendMail.js"
import FlowHistory from "../models/FlowHistory.js"

const THINGSPEAK_CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID || "3055434"
const THINGSPEAK_READ_API_KEY = process.env.THINGSPEAK_READ_API_KEY || "ZUS2JSR26N6Q3STH"
const THINGSPEAK_WRITE_API_KEY = process.env.THINGSPEAK_WRITE_API_KEY || "RCIQHOPZRFB0M4YK"

// Track if email was already sent to avoid spam
const emailSentTracker = new Map()

export const getFlowData = async (req, res) => {
  try {
    const resp = await axios.get(`https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=1`)
    const feed = resp.data.feeds[0]
    
    if (!feed) {
      return res.status(404).json({ message: "No data available from ThingSpeak" })
    }
    
    const flowRate = parseFloat(feed.field1) || 0
    const valveStatus = feed.field2
    const valveStatusText = valveStatus === "1" ? "CLOSED" : "OPEN"

    // Determine event type
    let event = "NORMAL"
    if (valveStatus === "1") {
      event = "VALVE_CLOSED"
    } else if (flowRate > 20) {
      event = "LEAK_DETECTED"
    }

    // Save to history database
    try {
      await FlowHistory.create({
        userId: req.user._id,
        flowRate: flowRate,
        valveStatus: valveStatusText,
        event: event,
        timestamp: new Date(feed.created_at)
      })
    } catch (historyErr) {
      console.error("Error saving history:", historyErr.message)
    }

    // Send email only if valve just closed (status = 1) and email not sent recently
    const userEmail = req.user.email
    const lastEmailTime = emailSentTracker.get(userEmail)
    const now = Date.now()
    
    if (valveStatus === "1" && (!lastEmailTime || now - lastEmailTime > 300000)) {
      // Send email only once every 5 minutes
      await sendMail(
        userEmail,
        "🚨 Water Flow Alert - Valve Closed",
        `Hello ${req.user.name},\n\nYour water valve has been automatically closed due to continuous water flow for more than 5 minutes.\n\nFlow Rate: ${flowRate.toFixed(2)} L/min\nValve Status: CLOSED\n\nPlease check your water system and open the valve from your dashboard if everything is okay.\n\n- HydroFlow Monitor System`
      )
      emailSentTracker.set(userEmail, now)
    }

    res.json({ 
      flowRate: flowRate.toFixed(2), 
      valveStatus: valveStatusText,
      timestamp: feed.created_at
    })
  } catch (err) {
    console.error("Error fetching flow data:", err.message)
    res.status(500).json({ message: err.message })
  }
}

export const getFlowDataLite = async (req, res) => {
  try {
    const resp = await axios.get(`https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=1`)
    const feed = resp.data.feeds[0]
    const flowRate = parseFloat(feed.field1) || 0
    const valveStatus = feed.field2

    res.json({ 
      flowRate: flowRate.toFixed(2), 
      valveStatus: valveStatus === "1" ? "CLOSED" : "OPEN",
      timestamp: feed.created_at
    })
  } catch (err) {
    console.error("Error fetching flow data:", err.message)
    res.status(500).json({ message: err.message })
  }
}

export const controlValve = async (req, res) => {
  try {
    const { action } = req.body // action: "open" or "close"
    
    if (!action || (action !== "open" && action !== "close")) {
      return res.status(400).json({ message: "Invalid action. Use 'open' or 'close'" })
    }

    // Field 3 is the command field: 1 = OPEN, 0 = CLOSE
    const commandValue = action === "open" ? 1 : 0
    
    // Update ThingSpeak Field 3 to send command to ESP32
    const updateUrl = `https://api.thingspeak.com/update?api_key=${THINGSPEAK_WRITE_API_KEY}&field3=${commandValue}`
    const response = await axios.get(updateUrl)
    
    if (response.data === 0) {
      return res.status(500).json({ message: "Failed to update ThingSpeak. Please try again." })
    }

    // Save valve control action to history
    try {
      await FlowHistory.create({
        userId: req.user._id,
        flowRate: 0,
        valveStatus: action === "open" ? "OPEN" : "CLOSED",
        event: action === "open" ? "VALVE_OPEN" : "VALVE_CLOSED",
        timestamp: new Date()
      })
    } catch (historyErr) {
      console.error("Error saving valve action to history:", historyErr.message)
    }

    console.log(`✅ Valve ${action.toUpperCase()} command sent by ${req.user.email}`)
    
    res.json({ 
      success: true,
      message: `Valve ${action} command sent successfully`,
      action: action.toUpperCase(),
      entryId: response.data
    })
  } catch (err) {
    console.error("Error controlling valve:", err.message)
    res.status(500).json({ message: err.message })
  }
}

export const getHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * limit

    // Get all history records (not filtered by user since this is a single-user system)
    const history = await FlowHistory.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await FlowHistory.countDocuments({})

    console.log(`✅ History fetched: ${history.length} records for ${req.user.email}`)

    res.json({
      history: history.map(item => ({
        id: item._id,
        flowRate: item.flowRate,
        valveStatus: item.valveStatus,
        event: item.event,
        timestamp: item.timestamp
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error("Error fetching history:", err.message, err.stack)
    res.status(500).json({ message: err.message })
  }
}