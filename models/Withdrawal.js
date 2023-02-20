const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawalSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['bank', 'crypto'],
      required: true,
    },
    bankName: { type: String, required: true },
    accountNumber: { type: Number, required: true },
    accountName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['successful', 'failed', 'pending'],
      required: true,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
