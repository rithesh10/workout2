import { asyncHandler } from "../asyncHandler.js";
import { run } from "../geminiAPI.js";
import { Exercise } from "../models/Exercise.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";

async function ExerciseFunction(ex) {
  // console.log("Exercise data received:", ex);
  let totalExercises = [];

  // Ensure 'ex' is an array, if not, just skip the function and return
  if (!Array.isArray(ex)) {
    console.error("Expected an array for 'ex', but received:", typeof ex);
    return ; // Skip processing if 'ex' is not an array
  }

  try {
    // Process each day's exercises and filter them
    await Promise.all(
      ex.map(async (day, dayIndex) => {
        // Ensure each day contains the 'exercises' array, if not skip processing this day
        if (!Array.isArray(day.exercises)) {
          console.warn(`Skipping day ${dayIndex} because 'exercises' is not an array.`);
          return; // Skip this day
        }

        const exerciseNames = day.exercises.map((exercise) => exercise.name);
        
        // Error handling for filterExercises
        try {
          const filteredExercises = await filterExercises(exerciseNames);
          totalExercises.push(...filteredExercises);
        } catch (error) {
          console.error("Error filtering exercises:", error);
        }
      })
    );

    const chunkSize = 5;
    const allResults = [];

    // Split into chunks for API call and process each chunk
    for (let i = 0; i < totalExercises.length; i += chunkSize) {
      const exerciseChunk = totalExercises.slice(i, i + chunkSize);
      const prompt = `
        For each exercise name in the list, return the information in an array of JSON objects, formatted as follows:
        note: give ytLink as empty string
        [
            {
                "name": "<Exercise Name>",
                "description": "<Brief description of the exercise>",
                "performing": "<how to do it explained in detail>",
                "ytLink": "",
                "muscleGroup": "<Primary muscle group targeted>",
                "difficulty": "<Difficulty level: Beginner, Intermediate, or Advanced>"
            },
            ...
        ]
        Array of exercises:
        ${JSON.stringify(exerciseChunk)}
      `;

      try {
        const text = await run(prompt);

        const cleanedAnswer = text.replace(/```json|```/g, '').trim();
        const jsonStart = cleanedAnswer.indexOf('[');
        const jsonEnd = cleanedAnswer.lastIndexOf(']') + 1;
        const jsonString = cleanedAnswer.substring(jsonStart, jsonEnd);

        const parsedResult = JSON.parse(jsonString);
        allResults.push(...parsedResult);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        throw new ApiError(500, "Error fetching exercise data from Gemini API");
      }
    }

    // console.log("All fetched exercise data:", allResults);

    // Error handling for database schema generation
    try {
      await generateExerciseSchema(allResults);
    } catch (error) {
      console.error("Error generating exercise schema:", error);
      throw new ApiError(500, "Error generating exercise schema in the database");
    }

  } catch (error) {
    console.error("Error processing exercises:", error);
    throw new ApiError(500, "Error processing exercises");
  }
}

// Generates exercise schema and saves to database
async function generateExerciseSchema(DataOfExercises) {
  try {
    for (const exercise of DataOfExercises) {
      if (Object.keys(exercise).length === 6) {
        await Exercise.create(exercise);
      }
    }
    // console.log("Successfully added data to the database");
  } catch (error) {
    console.error("Error saving exercise data to the database:", error);
    throw new ApiError(500, "Failed to save exercise data to the database");
  }
}

// Filters exercises already in the database
async function filterExercises(exercises) {
  let filtered = [];
  try {
    for (const name of exercises) {
      const isPresent = await Exercise.find({ name });
      if (!isPresent.length) {
        filtered.push({ name });
      }
    }
  } catch (error) {
    console.error("Error during filtering:", error);
    throw new ApiError(500, "Error filtering exercises");
  }
  return filtered;
}
const getExerciseData=asyncHandler(async(req,res)=>{
  // const {exerciseName}=req.body;
  // console.log(exerciseName)
  const exerciseData=await Exercise.find({})
  // console.log(exerciseData)
  // console.log(exerciseData)
  if(!exerciseData)
  {
    throw new ApiError(404,"Exercise not found");
  }
  return res.status(200).json(new ApiSuccess(200,exerciseData))


})
const updateExerciseData=asyncHandler(async(req,res)=>{
  try {
      const id=req.params.id;
      const ytLink=req.body;
      console.log(ytLink);
      
      const exercise=await Exercise.findByIdAndUpdate(id,
        ytLink
      ,
    {
      new:true
    })
    return res.status(200).json(new ApiSuccess(200,exercise,"Successfully updated the exercise data"))
  } catch (error) {
    console.log(error)
    return res.status(500).json(new ApiError(500,"internal server error"))
  }
})

export { ExerciseFunction ,getExerciseData,updateExerciseData};
