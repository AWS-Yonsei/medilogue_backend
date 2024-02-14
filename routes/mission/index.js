const express = require("express");
const router = express.Router();

const create = require("./create.js");
const read = require("./read.js");
const update = require("./update.js");

router.use("/create", create);
router.use("/", read);
router.use("/update", update);

module.exports = router;