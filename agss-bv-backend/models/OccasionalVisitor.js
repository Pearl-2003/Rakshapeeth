const mongoose = require('mongoose');

const companionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Companion phone must be 10 digits"]
  }
}, { _id: false });

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
  companions: {
        type: [companionSchema],
        default: []
      },
 
    vehicleType: {
      type: String,
      enum: ["Private", "Public", "None"],
      default: "None"
    },
    driverName: {
  type: String,
  trim: true
},

driverPhone: {
  type: String,
  match: [/^\d{10}$/, "Driver phone must be 10 digits"]
},

driverVehicleNumber: {
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
  match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
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
occasionalVisitorSchema.pre("validate", function (next) {
  if (this.vehicleType === "Public") {
    if (!this.driverName) {
      return next(new Error("Driver name is required for public transport"));
    }

    if (!this.driverPhone || !/^\d{10}$/.test(this.driverPhone)) {
      return next(new Error("Valid 10-digit driver phone is required"));
    }

    if (!this.driverVehicleNumber) {
      return next(new Error("Driver vehicle number is required"));
    }
  }

  next();
});

const OccasionalVisitor = mongoose.model(
  'OccasionalVisitor',
  occasionalVisitorSchema
);

module.exports = OccasionalVisitor;