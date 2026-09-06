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
      type: String, // e.g. "6 LPA" — kept as string to allow ranges/text
      default: '',
    },
    applicationStatus: {
      type: String,
      enum: ['Not Applied', 'Applied', 'Test', 'Interview', 'Selected', 'Rejected'],
      default: 'Not Applied',
    },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);