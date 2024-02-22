const express = require("express");
const User = require("../../model/user");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const data = {
      "uid": "user2",
      "Gender": 1,
      "AGE": 36,
      "Urea": 4.7,
      "Cr":46,
      "HbA1c":5.6,
      "Chol":11,
      "TG":1.2,
      "HDL":1.2,
      "LDL":8,
      "VLDL":0.8,
      "BMI":24,
      "timestamp": "202-09-01T00:00:00Z"
  }

  return res.status(200).json({
    success: true,
    data: data
  });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const {uid, predicted_label, probability, features} = req.body;
    console.log(uid,predicted_label, probability, features);
    res.status(200).json({
      success: true,
    });
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;