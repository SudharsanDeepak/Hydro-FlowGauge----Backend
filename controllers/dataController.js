import axios from "axios"
import sendMail from "../utils/sendMail.js"

export const getFlowData = async (req, res) => {
  try {
    const resp = await axios.get(`https://api.thingspeak.com/channels/3055434/feeds.json?api_key=ZUS2JSR26N6Q3STH&results=1`)
    const feed = resp.data.feeds[0]
    const flowRate = feed.field1
    const valveStatus = feed.field2

    if (valveStatus === "1") {
      await sendMail(
        req.user.email,
        "🚨 Water Flow Alert",
        `Hello ${req.user.name},\n\nYour water flow has been cut off due to continuous flow.\n\nFlow Rate: ${flowRate} L/min\nValve Status: CLOSED\n\n- WaterFlow Monitor`
      )
    }

    res.json({ flowRate, valveStatus })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}