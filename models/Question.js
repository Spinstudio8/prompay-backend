const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: Number, required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
