const jwt = require("jsonwebtoken");

function parseJWTPayload(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) throw err;
    return decoded;
  });
}

module.exports = {parseJWTPayload};