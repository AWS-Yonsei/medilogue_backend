const mongoose = require("mongoose");
const autoIdSetter = require("./auto_increment.js");

const quizSchema = mongoose.Schema({
  qid: {
    type: Number
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    enum: ['O', 'X']
  },
  reason: {
    type: String,
  }
});
autoIdSetter(quizSchema, mongoose, "quiz", "qid");
// 데이터베이스 모델을 정의
const quiz = mongoose.model("quiz", quizSchema);

module.exports = quiz;