
const mongoose = require('mongoose');

const occasionalVisitorSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: true,
    trim: true
  },

  noOfCompanions: {
    type: Number,
    required: true,
    min: 0
  },

  vehicleNo: {
    type: String,
    trim: true,
    uppercase: true
  },

  visitorType: {
    type: String,
    enum: ['Parent', 'Non-Parent'],
    required: true
  },

  reason: {
    type: String,
    required: true,
    trim: true
  },

  phoneNumber: {
    type: String,
    required: true,
    match: [/^\+?[1-9]\d{9,14}$/, "Invalid phone number"]
  },

  dateOfVisit: {
    type: Date,
    required: true
  }
}, { timestamps: true });

/* 🔍 INDEXES FOR FILTERS & SEARCH */
occasionalVisitorSchema.index({ visitorName: 1 });
occasionalVisitorSchema.index({ phoneNumber: 1 });
occasionalVisitorSchema.index({ vehicleNo: 1 });
occasionalVisitorSchema.index({ visitorType: 1 });
occasionalVisitorSchema.index({ dateOfVisit: 1 });
occasionalVisitorSchema.index({ noOfCompanions: 1 });
occasionalVisitorSchema.index({ reason: "text" });

const OccasionalVisitor = mongoose.model(
  'OccasionalVisitor',
  occasionalVisitorSchema
);

module.exports = OccasionalVisitor;
