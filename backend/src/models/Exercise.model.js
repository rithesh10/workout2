import mongoose, { Schema } from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  performing:{
    type:String,
    required:true,
  },
  ytLink: {
    type: String,
    default: '',
  },
  muscleGroup: {
    type: String, // Only one muscle group
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

export {Exercise}
