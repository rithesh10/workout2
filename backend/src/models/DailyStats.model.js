// const mongoose = require("mongoose");
import mongoose from "mongoose";

const dailyStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // Ensure one record per day
  },
  totalUsers: {
    type: Number,
    default: 0,
  },
  newUsers: {
    type: Number,
    default: 0,
  },
  activeWorkouts: {
    type: Number,
    default: 0,
  },
  activeDiets:{
    type:Number,
    default:0
  },
  revenue: {
    type: Number,
    default: 0,
  },
});

export const DailyStats = mongoose.model("DailyStats", dailyStatsSchema);

// module.exports = DailyStats;
