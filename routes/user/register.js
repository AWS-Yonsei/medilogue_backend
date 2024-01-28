// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const Room = require("../../model/chatRoom");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  let categories = await Category.find();
  if (categories == null || categories.length == 0) {
    return res.status(400).json({
      success: false,
      errors: "Failed to load category.",
    });
  }
  return res.status(200).json({
    success: true,
    categories: categories,
  });
});

router.post("/check-duplicate", async (req, res) => {
  const uid = req.body.uid;
  let user = await User.findOne({ uid: uid });
  if (user) {
    return res.status(400).json({
      errors: [{ msg: "User already exists" }],
      duplication: true,
    });
  }
  return res.status(200).json({
    duplication: false,
  });
});

router.post("/", async (req, res) => {
  const { uid, password, name, type, gender, birth } = req.body;

  try {
    // email을 비교해서 user가 이미 존재하는지 확인
    // 존재한다면 return해서 뒤의 코드를 실행하지 않음.
    let user = await User.findOne({ uid: uid });
    if (user) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "User already exists" }],
      });
    }

    // user가 존재하지 않으면 새로운 user에 대해서 DB에 추가
    user = new User({
      uid : uid,
      password : password,
      name : name,
      type : type,
      gender : gender,
      birth : birth,
    });

    await user.save((err, doc) => {
      if (err)
        return res.status(401).json({
          success: false,
          err,
        });
      return res.status(200).json({
        success: true,
        user,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;