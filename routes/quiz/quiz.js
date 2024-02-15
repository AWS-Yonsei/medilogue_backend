//post : user가 quiz를 응시한 결과를 가져온 다음 저장하는 API
//get : 퀴즈 목록을 가져오는 API
//elastic에 바로 저장????????

const express = require("express");
const router = express.Router();

const Quiz = require("../../model/quiz");
const User = require("../../model/user");

const utils = require("../../utils.js");

router.post("/result", async (req, res) => {
  //퀴즈 응시 후, 결과를 저장하는 API
  /*
  성공하면 {
    "success": true
  } 로 응답이 온다.
  */
  try {
    const { uid, category, quiz_results } = req.body;
    let user = await User.findOne({uid: uid});
    if(user != undefined){
      console.log(user.quizResults);
      const existingResultIndex = user.quizResults.findIndex(data => data.category === category);
      if (existingResultIndex !== -1) {
        user.quizResults[existingResultIndex] = { category: category, results: quiz_results };
      } else {
        user.quizResults.push({ category: category, results: quiz_results });
      }
      await user.save(async (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            success: false,
            error: [{ msg: err }],
          });
        }
        return res.status(200).json({
          success: true,
        });
      });        
    }
    else{
        return res.status(404).json({
          success: false,
          message: "user not found",
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

router.get("/result", async (req, res) => {
  //환자에게 퀴즈에 대한 피드백을 보여주는 API
  //filter를 이용해서 틀린 문제만 가져온다.
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let user = await User.findOne({uid: user_data.user.uid});
    if(user != undefined){
      var feedback = new Array();
      for(var i=0; i<user.quizResults.length; i++){
        feedback.push(user.quizResults[i].results.filter((quiz) => quiz.result === false));
      }
      return res.status(200).json({
          success: true,
          feedback: feedback,
      });
    }
    else{
        return res.status(400).json({
          success: false,
          message: "user not found",
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