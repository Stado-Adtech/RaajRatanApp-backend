import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    otp: String,
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Auth', authSchema);