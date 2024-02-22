const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const Clinic = require("../../model/clinic");

router.post("/", async (req, res) => {
    try {
        console.log("SST");
        const {doctor_id, patient_id, content} = req.body;

        console.log(doctor_id, patient_id, content);
        const doctor = await User.findOne({uid: doctor_id});
        const patient = await User.findOne({uid: patient_id});
        console.log(doctor,patient);

        let clinic = new Clinic({
            title: "의사:"+doctor.name+", 환자:" +patient.name+"의 화상상담",
            content: content,
            "doctor.name": doctor.name,
            "doctor.specialization": "내과",
            "patient.name": patient.name,
            "patient.age": patient.age,
            "patient.gender": patient.gender,
            date: Date.now(),
        });
        
        await clinic.save(async (err, doc) => {
            if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                error: [{ msg: "clinic upload failed!" }],
            });
            }
            console.log(clinic);
    
            return res.status(200).json({
            //추가적으로 데이터가 필요하다면 추가할 것.
            success: true,
            message: "자동으로 화상상담 데이터가 등록되었습니다."
            });
        });
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;