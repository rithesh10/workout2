import mongoose ,{Schema}from 'mongoose'
import jwt from  "jsonwebtoken";
import bcrypt from "bcrypt";
import PhoneNumber from "awesome-phonenumber";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        role:{
            type:String,
            enum: ["user", "admin"],
            default:"user"

        },
        phone: {
            type: String,
            required: true,
            // validate: {
            //     validator: function (v) {
            //         const pn = new PhoneNumber(v);
            //         return pn.isValid();
            //     },
            //     message: (props) => `${props.value} is not a valid phone number`,
            // },
        },
        // profilePicture: {
        //     type: String,
        //     default: null,
        // },
        gender: {
            type: String,
            required: true,
            trim: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        workouts: [{ type: Schema.Types.ObjectId, ref: "Workout" }], // Reference to Workout schema
        diets:[{type:Schema.Types.ObjectId,ref:"Diet"}]
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return false;
    }
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
