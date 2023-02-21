const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      unique: true,
    },
    phone: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    birthDay: {
      type: Date,
      required: true,
    },
    location: { type: String },
    imageUrl: { type: String },
    password: { type: String, required: true, minlength: 10, maxlength: 255 },
    totalScore: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpiration: { type: Date },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    role: { type: String, default: 'user' },
    isAdmin: { type: Boolean, default: false },
    hasAuthority: { type: Boolean, default: false },
    assessments: [{ type: Schema.Types.ObjectId, ref: 'Assessment' }],
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
