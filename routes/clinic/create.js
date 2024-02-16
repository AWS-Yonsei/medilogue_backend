const express = require("express");
const Clinic = require("../../model/clinic");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, content, doctor_name, specialization, patient_name ,patient_age, patient_gender } =
      req.body;

    console.log(req.body);
    let clinic = new Clinic({
      title: title,
      content: content,
      "doctor.name": doctor_name,
      "doctor.specialization": specialization,
      "patient.name": patient_name,
      "patient.age": patient_age,
      "patient.gender": patient_gender,
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

      return res.status(200).json({
        //추가적으로 데이터가 필요하다면 추가할 것.
        success: true,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      err,
    });
  }
});

module.exports = router;