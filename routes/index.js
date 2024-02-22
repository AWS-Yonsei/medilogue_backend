const express = require("express");
const router = express.Router();

const register = require("./user/register.js");
const auth = require("./user/auth.js");
const login = require("./user/login.js");
//const logout = require("./user/logout.js")
const chat = require("./chat/chat.js")
const clinic = require("./clinic/index.js")
const mission = require("./mission/index.js")
const quiz = require("./quiz/quiz.js")
const calendar = require("./calendar/index.js")
const status = require("./user/status.js")
const mypage = require("./user/mypage.js")
const analyze = require("./user/analyze.js")

router.use("/register", register);
router.use("/auth", auth);
router.use("/login", login);
//router.use("/logout", logout);
router.use("/chat", chat);
router.use("/clinic", clinic);
router.use("/mission", mission);
router.use("/quiz", quiz);
router.use("/calendar", calendar);
router.use("/status", status);
router.use("/mypage", mypage);
router.use("/analyze", analyze);

module.exports = router;