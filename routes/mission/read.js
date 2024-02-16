const express = require("express");
const router = express.Router();

const Mission = require("../../model/mission");
const utils = require("../../utils.js");

router.get("/", async (req, res) => {
    //의사에게 미션을 관리중인 환자들의 목록들을 제공함.
    try {
      const token = req.header("authorization").split(" ")[1];
      const user_data = utils.parseJWTPayload(token);
      let missions;
      if(user_data.user.type=="Doctor"){
        missions = await Mission.find({
          "doctor.uid": user_data.user.uid,
        });
      }
      else{
        return res.status(400).json({
          success: false,
          error: "Invalid User Type",
        });
      }

    // Group missions based on patient's UID
      const groupedMissions = missions.reduce((acc, mission) => {
        const patient_uid = mission.patient.uid;
        if (!acc[patient_uid]) {
          acc[patient_uid] = [];
        }
        acc[patient_uid].push(mission);
        return acc;
      }, {});

      // Calculate completion ratio for each user
      let mission_rate = new Array();
      for (const patient_uid in groupedMissions) {
        const missions = groupedMissions[patient_uid];
        const name = missions[0].patient.name;
        const completedMissions = missions.filter(mission => mission.status === "completed");
        const completionRatio = completedMissions.length / missions.length;
        mission_rate.push({uid:patient_uid, name: name, success_rate:completionRatio});
      }

      return res.status(200).json({
        success: true,
        doctor_id: user_data.user.uid,
        mission_rate: mission_rate,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});


router.get("/:date", async (req, res) => {
  //환자에게 오늘의 미션 목록들을 제공함.
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    //날짜 처리를 해야 함.
    let missions = await Mission.find({
      "patient.name": user_data.user.name,
      startDate: {$lte: new Date(req.params.date)},
      endDate: {$gte: new Date(req.params.date)}
    });

    return res.status(200).json({
      success: true,
      missions: missions,
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