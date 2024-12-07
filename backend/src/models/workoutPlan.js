import mongoose ,{Schema} from "mongoose";

// Define a single schema for Workout Plan
const workoutPlanSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  FitnessGoal: {
    type: String,
    required: true,
  },
  FitnessLevel: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  dailyWorkouts: [
    {
      day: { type: String, required: true },
      exercises: [
        {
          name: { type: String, required: true },
          sets: { type: Number, required: true, default: 0 },
          reps: { type: String, required: false, default: null }, // Allow reps to be null
        },
      ],
    },
  ],
});

export const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
