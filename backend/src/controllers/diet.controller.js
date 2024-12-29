import { asyncHandler } from "../asyncHandler.js";
import { run } from "../geminiAPI.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { Workout } from "../models/workout.model.js";// Import the Workout model
import { Diet } from "../models/diet.model.js";

const generateDietPlan = asyncHandler(async (req, res) => {
    const {  weight,monthlyBudget, height, FitnessGoal, FitnessLevel, message } = req.body;
    const userId=req.user._id;
    // console.log(req.user._id);
    const prompt = `
   Generate a diet plan for the below information below:
    1. User Information:
       - Weight: ${weight} kg
       - Height: ${height} cm
       - Gender:${req.user.gender}
       - Monthly Budget: ${monthlyBudget} INR
       - Fitness Goal: ${FitnessGoal}
       - Fitness Level:${FitnessLevel}
       - Description :${message}

    2. Diet Plan Requirements:
   - Provide a structured diet plan with daily meals
   - Each day's plan should include:
     - Meals, including:
       - Meal Type (Breakfast, Lunch, Dinner, Snack)
       - Food Items, with:
         - Name of the food item
         - Quantity (e.g., '1 cup', '200 grams')
         - Optional: Calories for each food item

**Expected JSON Format:**
{
  "dailyDiet": [
    {
      "typeOfMeal": "Breakfast",
      "FoodItems": [
        {
          "foodName": "Food item name",
          "quantity": "quantity (e.g., '1 cup', '200 grams')",
          "calories": Number
        }
      ]
    },
    {
      "typeOfMeal": "Lunch",
      "FoodItems": [
        {
          "foodName": "Food item name",
          "quantity": "quantity (e.g., '1 cup', '200 grams')",
          "calories": Number
        }
      ]
    },
    {
      "typeOfMeal": "Dinner",
      "FoodItems": [
        {
          "foodName": "Food item name",
          "quantity": "quantity (e.g., '1 cup', '200 grams')",
          "calories": Number
        }
      ]
    }
  ]
}
  `;
    
    const answer = await run(prompt);
    if (!answer) {
        throw new ApiError(400, "Unable to generate the workout plan");
    }
    // console.log("Full response from Gemini API:", answer);
    const jsonMatch = answer.match(/\{[\s\S]*\}/); 

    if (!jsonMatch) {
      throw new ApiError(400, "Invalid format returned from the API");
    }

    const cleanedAnswer = jsonMatch[0];
    let dietPlan;
try {
    dietPlan = JSON.parse(cleanedAnswer);    
} catch (error) {
    throw new ApiError(400, "Invalid format returned from the workout generator");
}


    // Create a new Workout document
    const newDietPlan = new Diet({
        user:userId,
        monthlyBudget:monthlyBudget,
        height,
        weight,
        fitnessGoal:FitnessGoal,
        fitnessLevel:FitnessLevel,
        dailyDiet: dietPlan.dailyDiet,
    });

    // Save the workout plan to the database
    await newDietPlan.save();

    // console.log("diet plan saved to database:", newDietPlan);

    return res.status(200).json(new ApiSuccess(200, newDietPlan, "Generated and saved diet plan"));
});
const getUserDietPlans = async (req, res) => {
    const userId = req.user._id; // Assuming you have user information in req.user
    try {
        const DietPlans = await Diet.find({ user: userId });
        const DietPlan=DietPlans[DietPlans.length-1];
        return res.status(200).json(new ApiSuccess(200, DietPlan, "Retrieved diet plans successfully."));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to retrieve diet plans."));
    }
};

const getDietPlan = asyncHandler(async(req,res)=>{
  const userId = req.params.userId;
  // console.log(" HEllo");
  try {
    const dietPlans = await Diet.find({ user: userId });
    if (dietPlans.length === 0) {
      throw new ApiError(
        400,
        "Invalid format returned from the workout generator",
      );
    }
    const dietPlan = dietPlans[dietPlans.length-1];

    return res
    .status(200)
    .json(
      new ApiSuccess(200, dietPlan, "DietPlan generated"),
    );

  } catch (error) {
    
  }
})

export { generateDietPlan,getUserDietPlans,getDietPlan };
