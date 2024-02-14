const mongoose = require('mongoose');

const medicalSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true
  },
  No_Pation: {
    type: Number,
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
  CLASS: {
    type: Number,
    required: true
  }
});

const Medical = mongoose.model('Medical', medicalSchema);

module.exports = Medical;
