// models/student.js
const mongoose = require("mongoose");

// -------------------------------------------
// Address Sub-schema
// -------------------------------------------
const addressSchema = new mongoose.Schema({
  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true }
});

// -------------------------------------------
// Counter Schema for auto-increment studentId
// -------------------------------------------
const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., "studentId"
  count: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

// -------------------------------------------
// Main Student Schema
// -------------------------------------------
const studentSchema = new mongoose.Schema(
  {
    student_id: {
      type: String,
      unique: true
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    personalEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    collegeEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    irisData: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    parentsEmail: {
      type: [String],
      required: true,
      validate: {
        validator: (emails) => emails.length > 0,
        message: "At least one parent email is required."
      }
    },

    rollNo: {
      type: String,
      required: true,
      unique: true
    },

    course: {
      type: String,
      required: true
    },

    address: {
      type: addressSchema,
      required: true
    },

    parentRefs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent"
      }
    ],

    currentStatus: {
      type: String,
      enum: ["inside", "outside"],
      default: "inside"
    }
  },
  { timestamps: true }
);

// -------------------------------------------
// Auto-generate studentId before saving
// Format: BTBTC23 + 3-digit counter
// Example: BTBTC23001
// -------------------------------------------
studentSchema.pre("save", async function (next) {
  if (this.studentId) return next(); // already assigned (updates)

  try {
    const counter = await Counter.findOneAndUpdate(
      { key: "studentId" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const num = String(counter.count).padStart(3, "0");
    this.studentId = `BTBTC23${num}`;

    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Student", studentSchema);
