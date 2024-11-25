import mongoose from "mongoose";

// Define a single schema for Workout Plan
const workoutPlanSchema = new mongoose.Schema({
  dailyWorkouts: [
    {
      day: { type: String, required: true },
      exercises: [
        {
          name: { type: String, required: true },
          sets: { type: Number, required: true, default: 0 },
          reps: { type: String, required: false, default: null },  // Allow reps to be null
        },
      ],
    },
  ],
});

export const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
