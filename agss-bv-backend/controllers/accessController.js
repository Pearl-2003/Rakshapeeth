// this is for the overriding of blacklist over whitelist ensuring 
// that no duplicate vehicle numbers exist in blacklist

const Whitelist = require('../models/whitelist');
const Blacklist = require('../models/Blacklist');

async function checkAccess(vehicleNo) {
  vehicleNo = vehicleNo.toUpperCase().trim();

  // 1️⃣ Check blacklist FIRST
  const blacklisted = await Blacklist.findOne({ vehicleNo });
  if (blacklisted) {
    return {
      allowed: false,
      reason: 'BLACKLISTED',
      details: blacklisted.reason
    };
  }

  // 2️⃣ Check whitelist
  const whitelisted = await Whitelist.findOne({ vehicleNo });
  if (whitelisted) {
    return {
      allowed: true,
      reason: 'WHITELISTED',
      owner: whitelisted.vehicleOwnerName,
      type: whitelisted.type
    };
  }

  // 3️⃣ Default deny
  return {
    allowed: false,
    reason: 'NOT_REGISTERED'
  };
}

module.exports = { checkAccess };