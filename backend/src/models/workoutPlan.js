import mongoose from "mongoose";

// Define the schema for the workout plan
const workoutPlanSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user (if needed)
//   goal: { type: String, required: true },
//   experienceLevel: { type: String, required: true },
  workoutPlan: {
    monday: { type: [String], required: true },
    tuesday: { type: [String], required: true },
    wednesday: { type: [String], required: true },
    thursday: { type: [String], required: true },
    friday: { type: [String], required: true },
    saturday: { type: [String], required: true },
    sunday: { type: [String], required: true },
  },
}, { timestamps: true });

// Create a model from the schema
export const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);


