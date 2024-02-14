const express = require("express");
const Mission = require("../../model/mission");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, content, startDate, endDate, doctor_id, doctor_name, specialization, patient_id, patient_name } =
      req.body;
    console.log(req.body);
    let mission= new Mission({
      title: title,
      content: content,
      startDate: startDate,
      endDate: endDate,
      status: "active",
      "patient.uid": patient_id,
      "patient.name": patient_name,
      "doctor.uid": doctor_id,
      "doctor.name": doctor_name,
      "doctor.specialization": specialization,
    });

    console.log(mission);

    await mission.save(async (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: false,
          error: [{ msg: "mission upload failed!" }],
        });
      }

      return res.status(200).json({
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