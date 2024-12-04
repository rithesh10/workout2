import { asyncHandler } from "../asyncHandler.js";
import PerformanceModel from "../models/Performance.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";

const AddPerformance=asyncHandler(async(req,res)=>{
    try {
        const {workoutName,sets}=req.body;
        console.log(workoutName,sets);
        console.log(workoutName,sets)
        const userID=req.user?._id;
        if(!workoutName)
        {
            throw new ApiError(404,"workout name is not found");
        }
        if (!Array.isArray(sets) || sets.length === 0) {
            throw new ApiError(404,"sets are required");
          }
        for(const set of sets)
        {
            if(set.set==undefined || set.rep==undefined || set.weight==undefined)
            {
                throw new ApiError(404,"rep and weight are required");
            }
        }
        
    
    
        let performance=await PerformanceModel.findOne({user:userID});
        if(!performance)
        {
             performance=new PerformanceModel({user:userID,workouts:[]})   
        }
        const workoutEntry={
            todayExercises:[
                {
                    workoutName,
                    sets
                }
            ]
        }
        performance.workouts.push(workoutEntry)
        await performance.save()
        console.log("Sucessfully saved the performance data")
        return res.status(200).json(new ApiSuccess(200,performance,"Successfully saved into the database"))
    } catch (error) {
        throw new ApiError(400,error,"Error pushing the data into the database");
        
    }

})
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
export {AddPerformance,getPerformance};