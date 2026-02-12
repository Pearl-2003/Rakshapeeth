
//const mongoose = require('mongoose');
const mongoose = require('mongoose');
const blacklistSchema = new mongoose.Schema({
  vehicleNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true
  },

  idProof: {
    type: {
      type: String,
      enum: ['Aadhaar', 'PAN', 'DL'],
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    }
  },

  reason: {
    type: String,
    required: true,
    trim: true,
  },

  dateAdded: {
    type: Date,
    default: Date.now,
  }
});

/* 🔍 INDEXES FOR FILTERS & SEARCH */
blacklistSchema.index({ vehicleNo: 1 });
blacklistSchema.index({ "idProof.type": 1 });
blacklistSchema.index({ "idProof.value": 1 });
blacklistSchema.index({ dateAdded: -1 });
blacklistSchema.index({ reason: "text" });

const Blacklist = mongoose.model('Blacklist', blacklistSchema);
module.exports = Blacklist;
