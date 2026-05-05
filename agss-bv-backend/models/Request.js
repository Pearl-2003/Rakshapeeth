
const mongoose = require("mongoose");

const companionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: {
  type: String,
  required: true,
  match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"]
}
}, { _id: false });

const requestSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true
    },

    studentName: {
      type: String,
      trim: true
    },

    studentId: {
      type: String,
      trim: true
    },

    idProofType: {
      type: String,
      enum: ["PAN", "AADHAAR", "DL"],
      required: true
    },

    visitorIdProof: {
      type: String,
      required: true,
      trim: true
    },

    vehicleType: {
      type: String,
      enum: ["Private", "Public", "None"],
      default: "None"
    },

    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/,
        "Invalid vehicle number format"
      ]
    },

    dateOfVisit: {
      type: Date,
      required: true
    },

    numberOfPeople: {
      type: Number,
      required: true,
      min: 0
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
    
    companions: {
      type: [companionSchema],
      default: []
    },

    // 🔥 REQUEST TABLE IS ONLY FOR "OTHER"
    reasonOfVisit: {
      type: String,
      enum: ["Other"],
      required: true
    },

    otherReason: {
      type: String,
      required: true,
      trim: true
    },

   phoneNumber: {
  type: String,
  required: true,
  trim: true,
  match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
},

    type: {
      type: String,
      enum: ["parent", "non-parent"],
      required: true
    },

    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending"
    }
  },
  { timestamps: true }
);
requestSchema.pre("validate", function (next) {
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
// Index for admin dashboard
requestSchema.index({ dateOfVisit: -1, status: 1 });

module.exports = mongoose.model("Request", requestSchema);