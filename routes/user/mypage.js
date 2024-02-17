const express = require("express");
const router = express.Router();

const Clinic = require("../../model/clinic.js");
const Medical = require("../../model/medical.js");
const utils = require("../../utils.js");

router.get("/", async (req, res) => {
  //유저의 mypage를 구성하는 데이터를 가져오는 API
  //환자와 의사의 경우에 따라 다르게 구성되어야 함
  try {
    const token = req.header("Authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    let clinics;
    if(user_data.user.type=="Doctor"){
        //의사가 환자의 상담 목록을 가져오는 경우
        clinics = await Clinic.find({
            "doctor.name": user_data.user.name,
        });

        return res.status(200).json({
          //isDoctor : true -> 의사의 mypage rendering
          isDoctor: true,
          clinics: clinics,
        });
    }
    else{
        //환자가 자신의 상담 목록을 가져오는 경우
        clinics = await Clinic.find({
            "patient.name": user_data.user.name
        });
        let medicals = await Medical.find({
          "patient.name": user_data.user.name
        });

        return res.status(200).json({
          //isDoctor : true -> 환자의 mypage rendering
          isDoctor: false,
          medicals: medicals,
          clinics: clinics,
        });
    }
    //TODO : 환자의 미션 수행 정도를 측정하는 지표를 넣어야 하는가?

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;