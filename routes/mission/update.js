const express = require("express");
const router = express.Router();

const Mission = require("../../model/mission");

router.put("/:id", async (req, res) => {
  try {
    const missionId = req.params.id;
    const mission = await Mission.findById(missionId);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    mission.status = "completed";
    await mission.save();

    res.json({ message: "Mission updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;