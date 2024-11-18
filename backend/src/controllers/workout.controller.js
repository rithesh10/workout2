import { asyncHandler } from "../asyncHandler.js";
import { run } from "../geminiAPI.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { Workout } from "../models/workout.model.js";// Import the Workout model
import {  ExerciseFunction } from "./Exercise.controller.js";

const generateWorkoutPlan = asyncHandler(async (req, res) => {
    const {  age, weight, height, FitnessGoal, FitnessLevel, message } = req.body;
    const userId=req.user._id;
    console.log(req.user._id);
    const prompt = `
    Generate a 7-day workout plan for a user based on the following parameters:

    1. User Information:
       - Age: ${age}
       - Weight: ${weight} kg
       - Height: ${height} cm
       - Gender: ${req.user.gender}
       - Fitness Goal: ${FitnessGoal}
       - Fitness Level:${FitnessLevel}
       - Description :${message}

    2. Workout Plan Requirements:
       
       - Provide a list of exercises for each day, including:
         - Exercise Name
         - Number of Sets
         - Number of Reps (in string format)
       - Include one rest day.
       if you give rest day the for the key exercises give the empty array

       - Format the output as JSON.
 don't forget that reps in the json format should always be string format only
    **Expected JSON Format:**
    {
      "dailyWorkouts": [
        {
          "day": "Monday",
      
          "exercises": [
            { "name": "Exercise Name", "sets": Number format, "reps": "Rep Range string format" }
          ]
        },
        ...
      ]
    }
  `;
    
    const answer = await run(prompt);
    if (!answer) {
        throw new ApiError(400, "Unable to generate the workout plan");
    }
    
    // Parse the answer to an object
    // console.log("Full response from Gemini API:", answer);

    const cleanedAnswer = answer.replace(/```json|```/g, '').trim();
    // console.log(cleanedAnswer)
    let workoutPlan ;
try {
    workoutPlan = JSON.parse(cleanedAnswer);    
} catch (error) {
    throw new ApiError(400, "Invalid format returned from the workout generator");
}
console.log("generated workout plan successfullly")


  // await Workout.deleteMany({ user: userId });

  console.log("Existing workout plans deleted for user:", userId);
    // Create a new Workout document
    const newWorkoutPlan = new Workout({
        user:userId,
        FitnessGoal,
        FitnessLevel,
        height,
        weight,
        age,
        dailyWorkouts: workoutPlan.dailyWorkouts,
    });
    // console.log(workoutPlan.dailyWorkouts)

    await newWorkoutPlan.save();
    // try {
    //       await ExerciseFunction(workoutPlan.dailyWorkouts)
    //       console.log("Exercise data successfully processed and saved.");
          
    // } catch (error) {
    //   throw new ApiError(400,"Error generating description model schema")
    // }
    // Save the workout plan to the database

    console.log("Workout plan saved to database:", newWorkoutPlan);

    return res.status(200).json(new ApiSuccess(200, newWorkoutPlan, "Generated and saved workout plan"));
});
const getUserWorkoutPlans = async (req, res) => {
    const userId = req.user._id; // Assuming you have user information in req.user
    try {
        const workoutPlans = await Workout.find({ user: userId });
        console.log(workoutPlans.length)
        const length=workoutPlans.length;
        const workoutPlan=workoutPlans[length-1]
        return res.status(200).json(new ApiSuccess(200, workoutPlan, "Retrieved workout plans successfully."));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to retrieve workout plans."));
    }
};


export { generateWorkoutPlan,getUserWorkoutPlans };
