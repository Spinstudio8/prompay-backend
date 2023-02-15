const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true, enums: ['payment from prompay'] },
  status: {
    type: String,
    enum: ['successful', 'failed'],
    required: true,
  },
  assessment: {
    type: Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
