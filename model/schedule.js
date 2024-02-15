const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  attendee: {
    //다른 참석자의 이름을 저장한다.
    type: String,
    required: true
  }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
