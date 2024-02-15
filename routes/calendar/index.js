const express = require("express");
const router = express.Router();

const create = require("./create.js");
const read = require("./read.js");
const update = require("./update.js");
const Delete = require("./delete.js");

router.use("/", read);
router.use("/create", create);
router.use("/update", update);
//router.use("/delete", Delete);

module.exports = router;