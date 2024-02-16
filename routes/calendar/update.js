const express = require("express");
const router = express.Router();
const utils = require("../../utils.js");
const Schedule = require("../../model/schedule.js");

router.put("/", async (req, res) => {
    //스케줄을 수정한다.
    try {
        const {sid, content, startDate, attendee } = req.body;
        
        const token = req.header("authorization").split(" ")[1];
        const user_data = utils.parseJWTPayload(token);
        const schedule = await Schedule.findOne({
            _id: sid,
            uid: user_data.user.uid,
        });
        if(schedule.uid != user_data.user.uid){
            return res.status(403).json({
                success: false,
                error: "Forbidden",
            });
        }
        schedule.startTime = startDate;
        schedule.content = content;
        schedule.attendee = attendee;
        schedule.save();
        return res.status(200).json({
            success: true,
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