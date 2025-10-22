import sendMail from '../utils/sendMail.js';

// Send mail using Brevo service
export const sendEmail = async (req, res) => {
  const { recipient, subject, message } = req.body;

  try {
    // Validate input
    if (!recipient || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient, subject, and message are required',
      });
    }

    // Send mail using Brevo
    await sendMail(recipient, subject, message);

    console.log('✅ Email sent to:', recipient);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      recipient: recipient,
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
};

export const getEmailStatus = async (req, res) => {
  res.status(200).json({
    status: 'active',
    lastCheck: new Date().toISOString(),
  });
};