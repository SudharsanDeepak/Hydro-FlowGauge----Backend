import pkg from 'nodemailer';
const { createTransport } = pkg;

const sendMail = async (to, subject, text) => {
  try {
    // Create SMTP transporter using your Brevo SMTP credentials
    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '988216002@smtp-brevo.com',
        pass: 'Ng3CMszba6DRk4dn'
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: '"WaterFlow Monitor" <988216002@smtp-brevo.com>',
      to: to,
      subject: subject,
      text: text,
      html: `<p>${text.replace(/\n/g, '<br>')}</p>`
    });

    console.log("✅ Email sent successfully via SMTP:", info.messageId);
    console.log("✅ Email sent to:", to);
    return true;
  } catch (error) {
    console.error("❌ Error sending email via SMTP:", error.message);
    throw error;
  }
};

export default sendMail;
