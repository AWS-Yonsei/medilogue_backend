const express = require("express");
const router = express.Router();

const Clinic = require("../../model/clinic");
const utils = require("../../utils.js");

router.get("/", async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let clinics;
    if(user_data.user.type=="Doctor"){
        //의사가 환자의 상담 목록을 가져오는 경우
        clinics = await Clinic.find({
            "doctor.name": user_data.user.name,
        });
    }
    else{
        //환자가 자신의 상담 목록을 가져오는 경우
        clinics = await Clinic.find({
            "patient.name": user_data.user.name,
        });
    }
    //TODO : 환자의 건강 데이터 불러오는 것 다른 API에서 해야하는가...?
    return res.status(200).json({
      success: true,
      clinics: clinics,
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