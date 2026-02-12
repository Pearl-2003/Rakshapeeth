// utils/normalizeVehicleNo.js
module.exports = function normalizeVehicleNo(vehicleNo) {
  if (!vehicleNo) return null;

  return vehicleNo
    .toUpperCase()
    .replace(/[\s-]/g, ""); // remove space & hyphen
};
