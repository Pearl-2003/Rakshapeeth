const mongoose = require("mongoose");

const guardDutyLogSchema = new mongoose.Schema(
  {
    guard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guard",
      required: true,
      index: true
    },

    loginAt: {
      type: Date,
      required: true,
      default: Date.now
    },

    logoutAt: {
      type: Date,
      default: null
    },

    autoClosed: {
      type: Boolean,
      default: false
    },

    closedBy: {
      type: String,
      enum: ["guard", "admin", "system"],
      default: "guard"
    }
  },
  { timestamps: true }
);

/* 🔹 Derived status (NO DB FIELD) */
guardDutyLogSchema.virtual("status").get(function () {
  return this.logoutAt ? "OFF_DUTY" : "ON_DUTY";
});

/* 🔹 Live duration (seconds) */
guardDutyLogSchema.virtual("duration").get(function () {
  const end = this.logoutAt || new Date();
  return Math.floor((end - this.loginAt) / 1000);
});

guardDutyLogSchema.set("toJSON", { virtuals: true });
guardDutyLogSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("GuardDutyLog", guardDutyLogSchema);
