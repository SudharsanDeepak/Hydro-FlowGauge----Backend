# 📧 HydroFlow Email Notification System

## Overview
This system automatically sends email notifications to the logged-in user and all configured recipients whenever the water valve closes automatically due to continuous flow.

---

## ✅ Features

1. **Automatic Email Notifications**: Sends alerts when valve closes automatically
2. **Multiple Recipients**: Add, edit, delete, and manage multiple email recipients
3. **Active/Inactive Toggle**: Enable or disable recipients without deleting them
4. **HTML Email Templates**: Beautiful, responsive email templates
5. **Rate Limiting**: Prevents spam by sending emails only once every 5 minutes
6. **SMTP Integration**: Uses Brevo (formerly Sendinblue) SMTP service

---

## 🔧 Setup Instructions

### Step 1: Update Your `.env` File

Add the following SMTP configuration to your `Backend/.env` file:

```env
# SMTP Configuration (Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_LOGIN=988216003@smtp-brevo.com
SMTP_PASSWORD=FsRCTqr8Q12Aw5xK
```

**⚠️ IMPORTANT**: Make sure your `.env` file is in `.gitignore` to protect your credentials!

### Step 2: Test SMTP Configuration

Run the test script to verify your SMTP setup:

```bash
cd Backend
node test-smtp.js
```

If successful, you should receive a test email at your configured email address.

### Step 3: Start Your Backend Server

```bash
cd Backend
npm start
# or for development
npm run dev
```

### Step 4: Start Your Frontend

```bash
cd FrontendNew/hydroflow
npm run dev
```

---

## 📋 How It Works

### Automatic Email Notifications

When the water valve closes automatically (due to continuous flow > 5 minutes):

1. **Email is sent to the logged-in user** (from Clerk authentication)
2. **Email is sent to all active recipients** in the database
3. **Rate limiting**: Emails are sent only once every 5 minutes to prevent spam
4. **HTML formatted**: Beautiful, responsive email templates with flow data

### Email Recipients Management

Navigate to the **Mail** page in your dashboard to:

- ✅ **Add new recipients**: Enter name and email address
- ✏️ **Edit recipients**: Update name or email
- 🔄 **Toggle active/inactive**: Temporarily disable without deleting
- 🗑️ **Delete recipients**: Remove permanently

---

## 🎯 API Endpoints

### Get All Recipients
```
GET /api/mail/recipients
Authorization: Required (Clerk Auth)
```

### Add New Recipient
```
POST /api/mail/recipients
Authorization: Required (Clerk Auth)
Body: { "email": "user@example.com", "name": "John Doe" }
```

### Update Recipient
```
PUT /api/mail/recipients/:id
Authorization: Required (Clerk Auth)
Body: { "email": "newemail@example.com", "name": "New Name", "isActive": true }
```

### Delete Recipient
```
DELETE /api/mail/recipients/:id
Authorization: Required (Clerk Auth)
```

### Get Email Status
```
GET /api/mail/status
Authorization: Public
```

---

## 📊 Database Schema

### EmailRecipient Model

```javascript
{
  userId: ObjectId,        // Reference to User
  email: String,           // Recipient email (unique per user)
  name: String,            // Recipient name
  isActive: Boolean,       // Active/Inactive status
  createdAt: Date         // Creation timestamp
}
```

**Indexes**: Compound unique index on `(userId, email)` to prevent duplicates

---

## 🧪 Testing

### Test SMTP Configuration
```bash
node test-smtp.js
```

### Test Automatic Notifications

1. Log in to your dashboard
2. Add some test recipients in the Mail page
3. Trigger valve closure (simulate continuous flow > 5 minutes)
4. Check emails for all recipients

---

## 🔒 Security

- ✅ All email routes are protected with Clerk authentication
- ✅ Users can only manage their own recipients
- ✅ SMTP credentials stored in `.env` (not in code)
- ✅ `.env` file excluded from Git via `.gitignore`
- ✅ Rate limiting prevents email spam

---

## 🎨 Email Template

The system sends beautifully formatted HTML emails with:

- 🚨 Alert header with emoji
- 📊 Flow rate and valve status
- ⏰ Timestamp
- 👤 Account owner information (for recipients)
- 📱 Responsive design for mobile devices

---

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials**: Run `node test-smtp.js`
2. **Verify environment variables**: Ensure all SMTP_* variables are set
3. **Check Brevo dashboard**: Verify your account is active
4. **Check server logs**: Look for error messages in console

### Recipients Not Showing

1. **Check authentication**: Ensure you're logged in with Clerk
2. **Check API endpoint**: Verify `/api/mail/recipients` is accessible
3. **Check browser console**: Look for JavaScript errors

### Emails Going to Spam

1. **Verify sender domain**: Ensure your Brevo account is verified
2. **Check SPF/DKIM records**: Configure in Brevo dashboard
3. **Avoid spam triggers**: Don't send too many emails too quickly

---

## 📝 Notes

- Emails are sent only when valve closes **automatically** (not manual closure)
- Rate limiting: One email per 5 minutes per user to prevent spam
- Recipients must have `isActive: true` to receive emails
- The logged-in user always receives emails (regardless of recipient list)

---

## 🚀 Future Enhancements

- [ ] Email templates customization
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Email delivery status tracking
- [ ] Scheduled email reports
- [ ] Email preferences per recipient

---

## 📞 Support

For issues or questions, check:
- Backend logs: `Backend/Server.js`
- Frontend console: Browser DevTools
- SMTP test: `node test-smtp.js`
