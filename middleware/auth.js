const User = require("../model/user");

const auth = (req, res, next) => {
  // 인증처리
  // client cookie에서 토큰 가져오기
  const token = req.cookies.x_auth_token;

  // token을 jwt로 decoding
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        isAuth: false,
        error: true,
      });
    }
    req.token = token;
    req.user = user;
    next();
  });
};
module.exports = { auth };