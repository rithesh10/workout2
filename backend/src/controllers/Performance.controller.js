import { asyncHandler } from "../asyncHandler.js";
import PerformanceModel from "../models/Performance.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";


const AddPerformance = asyncHandler(async (req, res) => {
    try {
        const { workoutName, sets } = req.body;
        const userID = req.user?._id;

        // Validate inputs
        if (!workoutName) {
            throw new ApiError(404, "Workout name is required");
        }
        if (!Array.isArray(sets) || sets.length === 0) {
            throw new ApiError(404, "Sets are required");
        }
        for (const set of sets) {
            if (set.set === undefined || set.rep === undefined || set.weight === undefined) {
                throw new ApiError(404, "Set, rep, and weight are required");
            }
        }

        // Find or create performance record for the user
        let performance = await PerformanceModel.findOne({ user: userID });
        if (!performance) {
            performance = new PerformanceModel({ user: userID, workouts: [] });
        }

        // Get today's date in ISO format (without time part)
        const today = new Date().toISOString().split("T")[0];

        // Check if a workout entry for today already exists
        let existingWorkout = performance.workouts.find(workout =>
            new Date(workout.date).toISOString().split("T")[0] === today
        );

        if (existingWorkout) {
            // Check if the workout name already exists in today's exercises
            const existingExercise = existingWorkout.todayExercises.find(
                exercise => exercise.workoutName === workoutName
            );

            if (existingExercise) {
                // Update the existing exercise's sets
                existingExercise.sets = sets;
            } else {
                // Add the new exercise to today's exercises
                existingWorkout.todayExercises.push({
                    workoutName,
                    sets,
                });
            }
        } else {
            // Create a new workout entry for today
            const workoutEntry = {
                date: new Date(), // Set the current date
                todayExercises: [
                    {
                        workoutName,
                        sets,
                    },
                ],
            };
            performance.workouts.push(workoutEntry);
        }

        // Save the updated performance record
        await performance.save();

        console.log("Successfully saved the performance data");
        return res.status(200).json(new ApiSuccess(200, performance, "Successfully saved into the database"));
    } catch (error) {
        console.error("Error:", error);
        throw new ApiError(400, error, "Error pushing the data into the database");
    }
});


const getPerformance=asyncHandler(async(req,res)=>{
    try {
        const userID=req.user?._id;
        const performance=await PerformanceModel.findOne({user:userID})
        if(!performance)
        {
            throw new ApiError(404,"The performance data has not found");
        }
        console.log("Successfully fetched the performance data")
        return res.status(200).json(new ApiSuccess(200,performance,"Successfully fetched the data "))
    } catch (error) {
        throw new ApiError(400,"Error fetching the data")
        
    }

})

const getUserPerformance=asyncHandler(async(req,res)=>{
    const userId = req.params.userId;
//   console.log(" HEllo");
  

  try {
    const performances = await PerformanceModel.find({ user: userId });
    // console.log(performances);
    
    if (!performances) {
      throw new ApiError(
        400,
        "No performance available",
      );
    }

    // const performance = workoutPlans[workoutPlans.length-1]

    return res
    .status(200)
    .json(
      new ApiSuccess(200, performances, "Performance generated"),
    );

  } catch (error) {
    console.log(`Error occurred ${error}`);
    
  }
})
const workoutPerformace=async(req,res)=>{
    const id=req.params.id;
  try {
    const users=await PerformanceModel.find({user:id});
    if(!users){
      return res.status(404).json({"message":"users not found"});
    }
    return res.status(200).json({"message":"users",users});
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({"message":error});
  }
}
export {AddPerformance,getPerformance,getUserPerformance,workoutPerformace};