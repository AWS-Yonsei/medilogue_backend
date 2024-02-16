const mongoose = require('mongoose');

const medicalSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  Gender: {
    type: Number,
    required: true
  },
  AGE: {
    type: Number,
    required: true
  },
  Urea: {
    type: Number,
    required: true
  },
  Cr: {
    type: Number,
    required: true
  },
  HbA1c: {
    type: Number,
    required: true
  },
  Chol: {
    type: Number,
    required: true
  },
  TG: {
    type: Number,
    required: true
  },
  HDL: {
    type: Number,
    required: true
  },
  LDL: {
    type: Number,
    required: true
  },
  VLDL: {
    type: Number,
    required: true
  },
  BMI: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Medical = mongoose.model('Medical', medicalSchema);

module.exports = Medical;
