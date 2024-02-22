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

router.get("/:id", async (req, res) => {
  try {
    // 1. child-process모듈의 spawn 취득
    const spawn = require('child_process').spawn;

    // 2. spawn을 통해 "python 파이썬파일.py" 명령어 실행
    const result=spawn('python', ['./diabetesModel/diab_patient_predict.py']);

    // 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
    result.stdout.on('data', function(data) {
        console.log(result.stdout);
        
        return res.status(200).json({
          data: result.toString(),
          success: true,
        });
    });

    // // 4. 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
    // result.stderr.on('data', function(data) {
    //     console.log(data.toString());
    //     return res.status(404).json({
    //       success: false,
          
    //     });
    // });
    
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