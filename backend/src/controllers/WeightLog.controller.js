import { asyncHandler } from "../asyncHandler.js";
import WeightLog from "../models/weight.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";

const AddWeightLog=asyncHandler(async (req,res)=>{
   try {
     const {weight}=req.body;
     const userID=req.user?._id;
     if(!weight)
     {
         throw new ApiError(400,"weight is required");
 
     }
     let weightLog=await WeightLog.findOne({user:userID})
     if(weightLog)
     {
         weightLog.entries.push({weight})
     }
     else{
         weightLog=new WeightLog({user:userID,entries:[{weight}]})
        // await weightLog.save()

        
     }
     await weightLog.save();
     return res.status(200).json(new ApiSuccess(200,weightLog,"SuccessFully added the weigth of the user to the database"))
   } catch (error) {
        throw new ApiError(400,error,"Unable to add the weight to the database")
   }
})
const getWeightData=asyncHandler(async(req,res)=>{
    try {
        const userID=req.user?._id;
        const weightLog=await WeightLog.findOne({user:userID})
        console.log(weightLog)
        if(!weightLog)
        {
            throw new ApiError(404,"Data not found");
        }
        return res.status(200).json(new ApiSuccess(200,weightLog,"Successfully fetched the data from the database"))
    } catch (error) {
        throw new ApiError(400,"Unable to fetch the data from the database");
    }
})
export {getWeightData,AddWeightLog}