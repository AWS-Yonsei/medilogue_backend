const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  qid: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  answer: {
    type: Boolean,
    required: true
  },
});

// 데이터베이스 모델을 정의
const quiz = mongoose.model("message", quizSchema);

module.exports = quiz;