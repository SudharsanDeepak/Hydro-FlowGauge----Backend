import dotenv from 'dotenv';
import sendMail from './utils/sendMailSMTP.js';

dotenv.config();

const testEmail = async () => {
  console.log('🧪 Testing SMTP Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST || '❌ NOT SET'}`);
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT || '❌ NOT SET'}`);
  console.log(`SMTP_LOGIN: ${process.env.SMTP_LOGIN || '❌ NOT SET'}`);
  console.log(`SMTP_PASSWORD: ${process.env.SMTP_PASSWORD ? '✅ SET' : '❌ NOT SET'}\n`);

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_LOGIN || !process.env.SMTP_PASSWORD) {
    console.error('❌ SMTP configuration is incomplete. Please check your .env file.');
    process.exit(1);
  }

  // Test email
  const testRecipient = process.env.TEST_EMAIL || 'your-email@example.com';
  
  console.log(`📧 Sending test email to: ${testRecipient}\n`);

  try {
    const result = await sendMail(
      testRecipient,
      '🧪 HydroFlow SMTP Test',
      'This is a test email from HydroFlow Monitor System.\n\nIf you receive this email, your SMTP configuration is working correctly!\n\nTimestamp: ' + new Date().toLocaleString(),
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #10B981; margin-top: 0;">🧪 SMTP Test Successful!</h2>
            <p style="font-size: 16px; color: #333;">This is a test email from <strong>HydroFlow Monitor System</strong>.</p>
            <p style="font-size: 16px; color: #333;">If you receive this email, your SMTP configuration is working correctly!</p>
            <div style="background-color: #D1FAE5; padding: 15px; border-left: 4px solid #10B981; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
              <p style="margin: 5px 0;"><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</p>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">- HydroFlow Monitor System</p>
          </div>
        </div>
      `
    );

    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${result.messageId}`);
    console.log('\n✨ Your SMTP configuration is working perfectly!\n');
  } catch (error) {
    console.error('❌ Failed to send test email:');
    console.error(error.message);
    console.error('\n💡 Please check your SMTP credentials and try again.\n');
    process.exit(1);
  }
};

testEmail();
