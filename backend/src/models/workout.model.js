import mongoose, { Schema } from "mongoose";

const workoutSchema = new Schema({
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
                    name: { type: String },
                    sets: { type: String },
                    reps: { type: String},
                },
            ],
        },
    ]
}, {
    timestamps: true,
});

export const Workout = mongoose.model("Workout", workoutSchema);
