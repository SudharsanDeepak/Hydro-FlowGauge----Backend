import SibApiV3Sdk from "sib-api-v3-sdk"

const sendMail = async (to, subject, text) => {
  try {
    let defaultClient = SibApiV3Sdk.ApiClient.instance
    let apiKey = defaultClient.authentications["api-key"]
    apiKey.apiKey = process.env.BREVO_API_KEY

    let tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()

    let sendSmtpEmail = {
      sender: { email: "no-reply@yourdomain.com", name: "WaterFlow Monitor" },
      to: [{ email: to }],
      subject: subject,
      textContent: text
    }

    await tranEmailApi.sendTransacEmail(sendSmtpEmail)
    console.log("✅ Email sent to", to)
  } catch (error) {
    console.error("❌ Error sending email:", error)
  }
}

export default sendMail