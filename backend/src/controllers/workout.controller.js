import { asyncHandler } from "../asyncHandler.js";
import { run } from "../geminiAPI.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { Workout } from "../models/workout.model.js"; // Import the Workout model
import { ExerciseFunction } from "./Exercise.controller.js";
import { testWorkout } from "../testing.js";
import { WorkoutPlan } from "../models/workoutPlan.js";

const generateWorkoutPlan = asyncHandler(async (req, res) => {
  
  const { age, weight, height, FitnessGoal, FitnessLevel, message } = req.body;
  const userId = req.user._id;
  // console.log(req.user._id);

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

  const cleanedAnswer = answer.replace(/```json|```/g, "").trim();
  // console.log(cleanedAnswer)
  let workoutPlan;
  try {
    workoutPlan = JSON.parse(cleanedAnswer);
  } catch (error) {
    throw new ApiError(
      400,
      "Invalid format returned from the workout generator",
    );
  }
  // console.log(answer);
  // console.log("generated workout plan successfullly");

  // await Workout.deleteMany({ user: userId });

  // console.log("Existing workout plans deleted for user:", userId);
  // Create a new Workout document
  const newWorkoutPlan = new Workout({
    user: userId,
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

  return res
    .status(200)
    .json(
      new ApiSuccess(200, newWorkoutPlan, "Generated and saved workout plan"),
    );
});
const getUserWorkoutPlans = async (req, res) => {
  const userId = req.user._id; // Assuming you have user information in req.user
  try {
    const workoutPlans = await Workout.find({ user: userId });
    const length = workoutPlans.length;
    const workoutPlan = workoutPlans[length - 1];
    return res
      .status(200)
      .json(
        new ApiSuccess(
          200,
          workoutPlan,
          "Retrieved workout plans successfully.",
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to retrieve workout plans."));
  }
};

const generate = asyncHandler(async (req, res) => {
  try {
    // Call the testWorkout function to generate the workout plan
    const { query } = req.body;
    const userId = req.user._id;
    const { age, weight, height, FitnessGoal, FitnessLevel, message } =
      req.body;
    const queryTemplate = `
  I am a ${age}-year-old male height is ${height} weighing ${weight} kg. My goal is to ${FitnessGoal}, 
  and I want a 7-day workout plan that focuses on ${message}. I am a ${FitnessLevel} at the gym 
  and want exercises that are suitable for my fitness level. Can you create a workout plan for me?
`;
    const response = await testWorkout(query);

    // Extract the generated text from the response
    const generated_text = response.data.generated_text;
    // console.log("Generated Text:", generated_text);

    // Regular expression to match days and workout details
    const workoutRegex =
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*([\s\S]+?)(?=\n(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):|$)/g;

    // Parse the workout plan into an object
    const workoutPlan = {};
    let match;
    while ((match = workoutRegex.exec(generated_text)) !== null) {
      const day = match[1].toLowerCase(); // Extract day name
      const exercises = match[2]
        .trim()
        .split("\n")
        .map((item) => item.replace(/^- /, "").trim()); // Clean up exercises
      workoutPlan[day] = exercises;
    }

    // console.log("Parsed Workout Plan:", workoutPlan);

    const transformWorkoutData = (plan) => {
      return Object.keys(plan).map((day) => {
        const exercises = plan[day].map((exercise) => {
          if (exercise.toLowerCase() === "rest day") {
            // Handle Rest Days with reps as null
            return { name: "Rest", sets: 0, reps: null }; // No reps for rest day
          }
          const [name, details] = exercise.split(":");
          if (!details) {
            // Default for malformed or incomplete exercises
            return { name: name.trim(), sets: 0, reps: null };
          }
          const [sets, reps] = details.trim().split("sets of");
          return {
            name: name.trim(),
            sets: parseInt(sets.trim()) || 0, // Default to 0 if parsing fails
            reps: reps ? reps.trim() : null, // Set reps as null if missing
          };
        });

        return { day: capitalize(day), exercises };
      });
    };

    // Helper function to capitalize day names
    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

    const transformedData = transformWorkoutData(workoutPlan);
    // console.log("Transformed Data:", JSON.stringify(transformedData, null, 2));

    // Create a new workout plan document
    const newWorkoutPlan = new WorkoutPlan({
      user: userId,
      FitnessGoal,
      FitnessLevel,
      height,
      weight,
      age,
      dailyWorkouts: transformedData,
    });

    // Save the new workout plan to the database
    await newWorkoutPlan.save();

    return res
    .status(200)
    .json(
      new ApiSuccess(200, newWorkoutPlan, "Generated and saved workout plan"),
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Error generating workout plan",
      error: error.message,
    });
  }
});

const getWorkoutPlan = asyncHandler(async(req,res)=>{
  const userId = req.params.userId;
  // console.log(" HEllo");
  

  try {
    const workoutPlans = await WorkoutPlan.find({ user: userId });
    if (workoutPlans.length === 0) {
      throw new ApiError(
        400,
        "Invalid format returned from the workout generator",
      );
    }

    const workoutPlan = workoutPlans[workoutPlans.length-1]

    return res
    .status(200)
    .json(
      new ApiSuccess(200, workoutPlan, "WorkoutPlan generated"),
    );

  } catch (error) {
    
  }
})
export { generateWorkoutPlan, getUserWorkoutPlans, generate, getWorkoutPlan };
