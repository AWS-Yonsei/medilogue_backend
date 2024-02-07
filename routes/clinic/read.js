const express = require("express");
const router = express.Router();

const Clinic = require("../../model/clinic");
const utils = require("../../utils.js");

router.get("/:id", async (req, res) => {
  //메인화면에 필요한 정보를 제공함.
  //토큰 받아와서 유저 확인하고 지역, 관심 카테고리를 알게 된다면 이에 대한 정보를 쭉 뿌려주면 된다.
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    //feed의 region은 array라서 그 속에 이게 있는지 판별해야 함.
    //hobby와 categories는 둘 다 array라서 쿼리가 복잡할 수 있음.
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
      //hobby_feeds: interest_hobby_feeds
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