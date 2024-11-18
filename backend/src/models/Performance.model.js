import mongoose, { Schema } from "mongoose";

const PerformanceSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workouts: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      todayExercises: [
        {
          workoutName: {
            type: String,
            required: true,
          },
          sets: [
            {
              set: {
                type: Number,
              },
              rep: {
                type: Number,  // Changed to Number
              },
              weight: {
                type: Number,  // Changed to Number
              },
            },
          ],
        },
      ],
    },
  ],
});

const PerformanceModel = mongoose.model("Performance", PerformanceSchema);
export default PerformanceModel;
