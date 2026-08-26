const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    registrationLink: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      default: '',
    },
    package: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);