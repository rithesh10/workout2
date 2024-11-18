import mongoose,{Schema} from "mongoose";
const WeightSchema=new Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        entries:[
            {
                weight:{
                    type:Number,
                    required:true
                },
                Date:{
                    type:Date,
                    default:Date.now
                }
            }
        ]
    }
)
const WeightLog=mongoose.model("WeightLog",WeightSchema)
export default WeightLog;