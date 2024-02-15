const express = require('express');
const Schedule = require('../../model/schedule.js');
const utils = require("../../utils.js");
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Get the schedule data from req.body
        const {content, startTime, attendee } = req.body;
        const token = req.header("authorization").split(" ")[1];
        const user_data = utils.parseJWTPayload(token);

        // Check if the schedule already exists
        const existingSchedule = await Schedule.findOne({ 
            uid: user_data.user.uid, 
            startTime: { $lte: new Date(Date.parse(startTime) + 30 * 60000), $gte: new Date(Date.parse(startTime) - 30 * 60000) }
        });

        if (existingSchedule) {
            res.status(400).json({ message: 'Schedule already exists' });
        } 
        else {
            const newSchedule = new Schedule({
                content: content,
                startTime: startTime,
                uid: user_data.user.uid,
                attendee: attendee,
            });
            await newSchedule.save();
            res.status(200).json({ message: 'Schedule created successfully' });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
