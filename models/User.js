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
    phone: { type: String, required: true, trim: true, unique: true },
    gender: { type: String, required: true, trim: true },
    birthDay: {
      type: Date,
      required: true,
    },
    password: { type: String, required: true, minlength: 10, maxlength: 255 },
    points: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verifcationCode: { type: String },
    verificationCodeExpiration: { type: Date },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
