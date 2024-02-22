const express = require("express");
const router = express.Router();

const create = require("./create.js");
const read = require("./read.js");
const stt = require("./stt.js");

router.use("/create", create);
router.use("/read", read);
router.use("/stt", stt);

module.exports = router;