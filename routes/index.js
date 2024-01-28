const express = require("express");
const router = express.Router();

const register = require("./user/register.js");
const auth = require("./user/auth.js");
const login = require("./user/login.js");
const logout = require("./user/logout.js")


router.use("/register", register);
router.use("/auth", auth);
router.use("/login", login);
router.use("/logout", logout);

module.exports = router;