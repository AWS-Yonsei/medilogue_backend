const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    enum: ['O', 'X']
  },
  options:{
    type: Array
  },
  reason: {
    type: String,
  }
});

const quiz = mongoose.model("quiz", quizSchema);

module.exports = quiz;