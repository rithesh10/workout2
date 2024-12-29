// const User = require("../models/User");
import { User } from "../models/user.model.js";
import { Workout } from "../models/workout.model.js";
import { DailyStats } from "../models/DailyStats.model.js";
import { Diet } from "../models/diet.model.js";


const updateDailyStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight for today's date

    const totalUsers = await User.countDocuments();
    // console.log(totalUsers);
    // (totalUsers)
    const newUsers = await User.countDocuments({
      createdAt: { $gte: today },
    });
    const activeWorkouts = await Workout.countDocuments()
    const activeDiets=await Diet.countDocuments();

    let revenue = totalUsers*1000; // Implement this function as per your logic
    // console.log(revenue)
    // revenue=revenue==NaN?0:revenue
    await DailyStats.findOneAndUpdate(
      { date: today },
      {
        $set: {
          totalUsers,
          newUsers,
          activeWorkouts,
          activeDiets,
          revenue,
        },
      },
      { upsert: true } // Update if exists, insert if not
    );

    console.log("Daily stats updated successfully!");
  } catch (error) {
    console.error("Error updating daily stats:", error);
  }
};

// Example revenue calculation function
const calculateRevenue = async () => {
  // Replace with your own revenue logic
  return 1000*User.countDocuments(); // Example static revenue
};

// module.exports = updateDailyStats;
export {updateDailyStats}
