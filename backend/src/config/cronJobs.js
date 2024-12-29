// const cron = require("node-cron");
import cron from 'node-cron'
import { updateDailyStats } from '../jobs/updateDailyStats.js';
// const updateDailyStats = require("../jobs/updateDailyStats");

const startCronJobs = () => {
  // Schedule the daily stats update to run at midnight every day
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily stats update...");
    await updateDailyStats();
  });
};

// module.exports = startCronJobs;
export {startCronJobs}
(async () => {
    await updateDailyStats();
  })()