import mongoose from 'mongoose';

const dietSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    fitnessGoal: {
        type: String, // e.g., Weight Loss, Muscle Gain, etc.
        required: true
    },
    fitnessLevel: {
        type: String, // e.g., Beginner, Intermediate, Advanced
        required: true
    },
    dailyDiet: [
        {
        typeOfMeal:{type:String,required:true},
        FoodItems: [
            {
                foodName: {
                    type: String, // Name of the food item
                    required: true
                },
                quantity: {
                    type: String, // e.g., '1 cup', '200 grams', etc.
                    required: true
                },
                calories: {
                    type: Number, // Caloric value of the food item
                    required: true
                }
            }
        ],
    }
]
       
       
    ,
}, { timestamps: true });

const Diet = mongoose.model('Diet', dietSchema);
export { Diet };
