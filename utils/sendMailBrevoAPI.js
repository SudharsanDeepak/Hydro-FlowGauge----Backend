import axios from 'axios';

/**
 * Send email using Brevo (SendinBlue) API instead of SMTP
 * This works on Render.com free tier (SMTP is blocked)
 */
const sendMailBrevoAPI = async (to, subject, text, html = null) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is missing in environment variables');
    }

    const htmlContent = html || `<p>${text.replace(/\n/g, '<br>')}</p>`;

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: process.env.SENDER_NAME || 'HydroFlow Monitor',
          email: process.env.SENDER_EMAIL
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: text
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log("✅ Email sent successfully via Brevo API:", response.data.messageId);
    console.log("✅ Email sent to:", to);
    return { success: true, messageId: response.data.messageId };
  } catch (error) {
    console.error("❌ Error sending email via Brevo API:", error.message);
    if (error.response) {
      console.error("❌ Brevo API error details:", error.response.data);
    }
    throw error;
  }
};

export default sendMailBrevoAPI;
