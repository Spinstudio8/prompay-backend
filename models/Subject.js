const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    totalQuestions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
