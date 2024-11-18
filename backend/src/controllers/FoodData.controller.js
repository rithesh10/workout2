import { asyncHandler } from "../asyncHandler.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import path from "path";

dotenv.config(); // Load environment variables

const generateFoodData = asyncHandler(async (req, res) => {
  try {
    const { FoodData } = req.body;
    // console.log("FoodData:", FoodData);
    // console.log("Uploaded file:", req.file); // Log the uploaded file details
    
    // Check if the file is present
    if (!req.file) {
      throw new ApiError(400, "Image file is missing."); // Correctly check for req.file
    }
    
    const imagePath = path.resolve(req.file.path); // Resolve the path to the uploaded file
    const imageData = await fs.readFile(imagePath); // Read the file data
    const imageFormat = imageData.toString("base64"); // Convert the file data to base64
    const mimeType = req.file.mimetype; // Get the MIME type directly from req.file // Corrected MIME type extraction

    const parts = [
      {
        text: `${FoodData} Provide the details of each food item and its calorie intake in the following JSON format:

        {
          "items": [
            { "name": "Item 1", "calories": "calories", "proteins": "proteins" },
            { "name": "Item 2", "calories": "calories", "proteins": "proteins" }
          ],
          "total_calories": "total calories"
        }`,
      },
      {
        inlineData: {
          mimeType,
          data: imageFormat,
        },
      },
    ];

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      generationConfig,
    });

    const data = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    const result = await data.response;
    const text = await result.text(); // Added `await` to handle the async text extraction

    const jsonMatch = text.match(/\{[\s\S]*\}/); // Matches JSON-like structure

    if (!jsonMatch) {
      throw new ApiError(400, "Invalid format returned from the API");
    }

    const cleanedAnswer = jsonMatch[0]; // Extra
    let FoodInformation;
    try {
      FoodInformation = JSON.parse(cleanedAnswer);
    } catch (error) {
      throw new ApiError(400, "Unable to parse into json");
    }
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
           
        }
        console.log('File deleted successfully.');
      
    });

    // Send parsed food information as response
    res.status(200).json(new ApiSuccess(200,FoodInformation,"generated food data"));
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Unable to generate the data");
  } finally {
    // Clean up the uploaded image file
    if (req.files?.FoodPicture[0]?.path) {
      await fs.unlink(req.files.FoodPicture[0].path);
    }
  }
});

export { generateFoodData };
