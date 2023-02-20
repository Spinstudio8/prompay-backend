const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['recharge card purchase', 'withdrawal', 'payment from prompay'],
    required: true,
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['successful', 'failed', 'pending'],
    required: true,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);

/*
In this schema, the Transaction model has four fields: user, amount, type,
 and date. The user field is a reference to the User model, the amount 
 field is the amount of money involved in the transaction, the type field 
 can be either "credit" or "debit" to indicate whether the transaction 
 added or subtracted money from the user's wallet, and the date field is 
 the date the transaction occurred.
*/
