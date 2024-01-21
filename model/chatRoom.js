const mongoose = require("mongoose");
const userSchema = require("./user");

const roomSchema = mongoose.Schema({
  room_id: {
    type: String,
  },
  users: {
    type: Array,
  },
});

// 데이터베이스 모델을 정의
const room = mongoose.model("room", roomSchema);

module.exports = room;