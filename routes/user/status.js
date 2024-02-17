const express = require("express");
const router = express.Router();

const Clinic = require("../../model/clinic.js");
const Medical = require("../../model/medical.js");
const User = require("../../model/user.js");
const utils = require("../../utils.js");

router.get("/:uid", async (req, res) => {
  //환자의 medical data를 가져오는 API
  try {
    const token = req.header("Authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    if(user_data.user.type=="Doctor"){
        //의사가 환자의 상담 목록을 가져오는 경우
        let clinics = await Clinic.find({
          "patient.name": req.params.uid
        });
        let medicals = await Medical.find({
          "patient.name": req.params.uid
        });
        let user = await User.findOne({ uid: req.params.uid });

        return res.status(200).json({
          user: user,
          medicals: medicals,
          clinics: clinics,
        });
    }
    else{
        return res.status(400).json({
          message: "invalid access",
        });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;