import sendMail from '../utils/sendMailSMTP.js';
import EmailRecipient from '../models/EmailRecipient.js';

// Get all email recipients for the logged-in user
export const getRecipients = async (req, res) => {
  try {
    const recipients = await EmailRecipient.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      recipients: recipients.map(r => ({
        id: r._id,
        email: r.email,
        name: r.name,
        isActive: r.isActive,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching recipients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipients',
      error: error.message
    });
  }
};

// Add a new email recipient
export const addRecipient = async (req, res) => {
  const { email, name } = req.body;

  try {
    // Validate input
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }

    // Check if recipient already exists for this user
    const existingRecipient = await EmailRecipient.findOne({
      userId: req.user._id,
      email: email.toLowerCase()
    });

    if (existingRecipient) {
      return res.status(400).json({
        success: false,
        message: 'This email is already in your recipient list'
      });
    }

    // Create new recipient
    const recipient = await EmailRecipient.create({
      userId: req.user._id,
      email: email.toLowerCase(),
      name: name.trim(),
      isActive: true
    });

    console.log('✅ Email recipient added:', email);

    res.status(201).json({
      success: true,
      message: 'Recipient added successfully',
      recipient: {
        id: recipient._id,
        email: recipient.email,
        name: recipient.name,
        isActive: recipient.isActive,
        createdAt: recipient.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error adding recipient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add recipient',
      error: error.message
    });
  }
};

// Update an email recipient
export const updateRecipient = async (req, res) => {
  const { id } = req.params;
  const { email, name, isActive } = req.body;

  try {
    // Find recipient and verify ownership
    const recipient = await EmailRecipient.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Update fields
    if (email) recipient.email = email.toLowerCase();
    if (name) recipient.name = name.trim();
    if (typeof isActive === 'boolean') recipient.isActive = isActive;

    await recipient.save();

    console.log('✅ Email recipient updated:', recipient.email);

    res.status(200).json({
      success: true,
      message: 'Recipient updated successfully',
      recipient: {
        id: recipient._id,
        email: recipient.email,
        name: recipient.name,
        isActive: recipient.isActive,
        createdAt: recipient.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error updating recipient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recipient',
      error: error.message
    });
  }
};

// Delete an email recipient
export const deleteRecipient = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete recipient, verify ownership
    const recipient = await EmailRecipient.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    console.log('✅ Email recipient deleted:', recipient.email);

    res.status(200).json({
      success: true,
      message: 'Recipient deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting recipient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipient',
      error: error.message
    });
  }
};

// Get email service status
export const getEmailStatus = async (req, res) => {
  try {
    // Check SMTP configuration
    const smtpConfigured = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_LOGIN &&
      process.env.SMTP_PASSWORD
    );

    res.status(200).json({
      success: true,
      status: smtpConfigured ? 'active' : 'not_configured',
      smtpConfigured,
      lastCheck: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check email status',
      error: error.message
    });
  }
};