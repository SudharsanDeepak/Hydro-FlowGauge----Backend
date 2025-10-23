import mongoose from "mongoose";

const emailRecipientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Support both ObjectId (traditional) and String (Clerk)
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate emails for the same user
emailRecipientSchema.index({ userId: 1, email: 1 }, { unique: true });

export default mongoose.model("EmailRecipient", emailRecipientSchema);
