import pkg from 'nodemailer';
const { createTransport } = pkg;

const sendMail = async (to, subject, text, html = null) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_LOGIN || !process.env.SMTP_PASSWORD) {
      throw new Error('SMTP configuration is missing in environment variables');
    }

    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const htmlContent = html || `<p>${text.replace(/\n/g, '<br>')}</p>`;
    const info = await transporter.sendMail({
      from: `"HydroFlow Monitor" <${process.env.SMTP_LOGIN}>`,
      to: to,
      subject: subject,
      text: text,
      html: htmlContent
    });

    console.log("✅ Email sent successfully via SMTP:", info.messageId);
    console.log("✅ Email sent to:", to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email via SMTP:", error.message);
    throw error;
  }
};

export default sendMail;
