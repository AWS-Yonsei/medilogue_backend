const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/auth"); // middleware 불러오기
const User = require("../../model/user");
const jwt = require("jsonwebtoken");

// localhost:5000/api/auth 로 GET 방식으로 들어왔을 때
router.get("/", auth, async (req, res) => {
  try {
    // auth 미들웨어에서 생성해준 req.user를 사용하여 DB에서 user 탐색. 패스워드에 대한 내용은 제외합니다.
    const user = await User.findById(req.user.id).select("-password");
    res.json(user); // 응답에 패스워드 정보를 제외한 사용자 정보 넣기
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;