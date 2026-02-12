const GuardDutyLog = require("../models/GuardDutyLog");

const MAX_SHIFT_HOURS = 16;

const autoCloseMissedDuties = async () => {
  try {
    const now = new Date();
    const maxMillis = MAX_SHIFT_HOURS * 60 * 60 * 1000;

    const activeDuties = await GuardDutyLog.find({
      logoutAt: null,
    });

    for (let duty of activeDuties) {
      const duration = now - duty.loginAt;

      if (duration > maxMillis) {
        duty.logoutAt = new Date(duty.loginAt.getTime() + maxMillis);
        duty.autoClosed = true;
        duty.closedBy = "system";
        await duty.save();

        console.log(
          `⚠️ Auto-closed duty for guard ${duty.guard} (exceeded ${MAX_SHIFT_HOURS} hrs)`
        );
      }
    }
  } catch (err) {
    console.error("Auto-close duty error:", err);
  }
};

module.exports = autoCloseMissedDuties;
