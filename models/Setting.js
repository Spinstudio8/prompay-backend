const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    setting: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingsSchema);
