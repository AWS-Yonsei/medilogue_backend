const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  user: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  room_id: {
    type: String,
    required: true
  },
});

// 데이터베이스 모델을 정의
const message = mongoose.model("message", messageSchema);

module.exports = message;