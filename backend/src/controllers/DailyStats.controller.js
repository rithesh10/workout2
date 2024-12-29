import { asyncHandler } from "../asyncHandler.js";
import { DailyStats } from "../models/DailyStats.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";

const getByDate=asyncHandler(async(req,res)=>{
    try {
        const date=new Date(req.params.date)
        // console.log(date);
        
        date.setHours(0,0,0,0);
        // console.log(date)
        const stats=await DailyStats.findOne({date})
        if(!stats)
        {
            return res.status(404).json(new ApiError(404,"No stats found"))
        }
        console.log("success")
        return res.status(200).json(new ApiSuccess(200,stats,'successful'))
    } catch (error) {
        log(error)
        return res.status(500).json(new ApiError(500,"Internal server error"))
        
    }
})
const latest=asyncHandler(async(req,res)=>{
    try {
        const stats=await DailyStats.findOne().sort({date:-1})
        if(!stats)
        {
            return res.status(404).json(new ApiError(404,"no stats found"))
        }
        return res.status(200).json(new ApiSuccess(200,stats,'successful'))
    } catch (error) {
        return res.status(500).json(new ApiError(500,"Internal server error"))
        
    }
})
export {latest,getByDate}