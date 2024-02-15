const express = require("express");
const router = express.Router();

const Schedule = require("../../model/schedule.js");
const utils = require("../../utils.js");

router.get("/:date", async (req, res) => {
  //유저가 선택한 날짜의 스케줄을 불러온다.
  try {
    const date = new Date(req.params.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let schedules = await Schedule.find({
        uid: user_data.user.uid,
        startTime: {
          $gte: new Date(year, month, 1),
          $lt: new Date(year, month + 1, 0),
        },
    });
    //같은 달 데이터 전부 불러옴
    return res.status(200).json({
      success: true,
      schedules: schedules,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;