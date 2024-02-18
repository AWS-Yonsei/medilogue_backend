// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const router = express.Router();
require("dotenv").config();
/*
TODO: 로그인 시에 device token을 받은 다음에 device table에 저장한다.
만약 해당 device token을 사용하고 있는 table이 발견된다면 그 테이블을 지우고 새로 table을 만든다.

*/
router.post("/", async (req, res) => {
  const { uid, password } = req.body;
  try {
    // id를 비교해서 user가 이미 존재하는지 확인
    // 존재한다면 return해서 뒤의 코드를 실행하지 않음.
    let user = await User.findOne({ uid: uid });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        loginSuccess: false,
        message: "user not found",
      });
    }

    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch)
        return res.status(400).json({
          loginSuccess: false,
          message: "password is not matched",
        });

      //jwt 생성하는 부분에서 에러 발생
      user.generateToken(async (err) => {
        if (err) return res.status(401).send(err);
        res.cookie("x_auth_token", user.token).status(200).json({
          loginSuccess: true,
          token: user.token,
        });
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;