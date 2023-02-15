const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: {
      type: [
        {
          question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
          },
          subject: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
          },
          answer: { type: Number, required: true },
          correct: { type: Boolean, required: true },
        },
      ],
      required: true,
    },
    score: { type: Number, default: 0 },
    amountEarned: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
