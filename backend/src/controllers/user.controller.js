import { asyncHandler } from "../asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import nodemailer from 'nodemailer';
import { promises as fs } from "fs";
import jwt from "jsonwebtoken";
// const domain = req.hostname.endsWith('.ngrok.io') ? '.ngrok.io' : 'localhost';
// const options = {
//   httpOnly: true,      // Ensures the cookie is not accessible via JavaScript (good for security).
//   secure: true,        // Ensures the cookie is sent only over HTTPS (important for ngrok's HTTPS URLs).
//   domain: '.ngrok-free.app',  // Makes the cookie available for all subdomains of ngrok-free.app.
//   path: '/',           // The cookie will be accessible for all paths within the domain.
//   sameSite: 'None',    // Allows the cookie to be sent in cross-site requests (important for cross-origin cookies with ngrok).
// };


const options = {
  httpOnly: true,
  // secure: true, // Only true in production
 // sameSite: "None", // Required for cross-origin cookies
  path: "/", 
};

let otpStore = {};

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    // console.log(user.refreshToken)
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens",
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { email, role,fullName, password, phone, gender } = req.body;
  // console.log(email,fullName,password,phone,gender);
  if (
    [fullName, email, password, phone, gender].some(
      (field) => field?.trim == "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, "User already existed");
    } else {
      console.log("No existing user found");
    }
  } catch (err) {
    throw new ApiError("Error finding user", err);
  }
//   const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
// let profilePicture = null;

// // Check if a profile picture was uploaded from the frontend
// if (profilePictureLocalPath) {
//   profilePicture = await uploadCloudinary(profilePictureLocalPath);
// } else {
//   console.log("No picture is uploaded. Uploading alternate image.");
//   // Set a default local image path and upload it
//   const defaultImagePath = "../public/emptyDP.jpeg";
//   profilePicture = await uploadCloudinary(defaultImagePath);
// }


  // Proceed with the rest of the logic, using profilePicture as null if no picture was uploaded.

  const user = await User.create({
    fullName,
    email,
    password,
    phone,
    role,
    // profilePicture: profilePicture.url,
    gender,
  });
  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!userCreated) {
    throw new ApiError(400, "User not created");
  } else {
    console.log("Success");
  }
  // fs.unlink(profilePictureLocalPath, (err) => {
  //   if (err) {
  //     console.error("Error deleting file:", err);
  //     return res.status(500).send("Error deleting file.");
  //   }
  //   console.log("File deleted successfully.");
  // });
  return res.status(201).json(new ApiSuccess(200, req.body, "Success"));
});
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password, fullName } = req.body;
//   // console.log(email, password);

//   // Validate input
//   if (!email) {
//     throw new ApiError(400, "Email is required");
//   }

//   // Find the user by email
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
  
//   // Check if the password is correct
//   const isPasswordCorrect = await user.isPassword(password);
//   if (!isPasswordCorrect) {
//     throw new ApiError(401, "Password mismatched"); // Use 401 for unauthorized access
//   }

//   // console.log(user,isPasswordCorrect)
//   // Generate access and refresh tokens
//   const tokens = await generateAccessAndRefreshToken(user._id);
//   // console.log("Tokens returned from generateAccessAndRefreshToken:", tokens); // Log tokens

//   // Check if tokens are correctly returned
//   if (!tokens) {
//     throw new ApiError(500, "Failed to generate tokens");
//   }

//   const { accessToken, refreshToken } = tokens;
//   // console.log(tokens)

//   // console.log(data)

//   // Fetch the logged-in user excluding sensitive fields
//   const loggedInUser = await User.findById(user._id).select(
//     "-password ",
//   );
//   // console.log(loggedInUser)

//   // Set cookies and send response
//   return res
//     .status(200) // Corrected from res(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiSuccess(
//         200,
//         {
//           user: loggedInUser,
//           accessToken,
//           refreshToken,
//         },
//         "user logged in successfully",
//       ),
//     )
//     ;
// });
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   // Validate input
//   if (!email || !password) {
//     throw new ApiError(400, "Email and password are required");
//   }

//   // Find the user by email
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // Check if the password is correct
//   const isPasswordCorrect = await user.isPassword(password);
//   if (!isPasswordCorrect) {
//     throw new ApiError(401, "Password mismatched");
//   }

//   // Generate a 6-digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000);

//   // Store OTP temporarily with expiration time (5 minutes expiry)
//   otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

//   // Generate a temporary token containing the email
//   const tempToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "5m", // Token valid for 5 minutes
//   });

//   // Send OTP to the user's email
//   const mailOptions = {
//     from: "saimadhav9235@gmail.com",
//     to: email,
//     subject: "Your Login OTP",
//     text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending OTP email:", error);
//       throw new ApiError(500, "Error sending OTP email");
//     }
//   });

//   res.status(200).json({
//     message: "OTP sent to email. Use the provided token to verify OTP.",
//     token: tempToken,
//   });
// });

// const loginOtp = asyncHandler(async (req, res) => {
//   const { otp } = req.body;
  
  
  
//   const token = req.headers.authorization?.split(" ")[1];  // Extract token from Authorization header

//   if (!token) {
//     throw new ApiError(400, "Token is required");
//   }

//   // Verify the token (using JWT)
//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//   } catch (err) {
//     throw new ApiError(401, "Invalid or expired token");
//   }

//   const email = decoded.email;  // Get email from token payload
//   console.log(email);
  
//   console.log("My opt",otp);
//   console.log("Ser",otpStore[email]);

//   // Check if OTP exists for this email and if it's valid
//   if (!otpStore[email]) {
//     throw new ApiError(400, "OTP not generated or has been cleared");
//   }

//   if (String(otpStore[email].otp) !== String(otp)) {
//     throw new ApiError(400, "Invalid OTP");
//   }

//   // Check if OTP has expired
//   const currentTime = Date.now();
//   if (currentTime > otpStore[email].expiresAt) {
//     delete otpStore[email]; // Clean up expired OTP
//     throw new ApiError(400, "OTP has expired");
//   }

//   // OTP is valid; remove it from the store after successful validation
//   delete otpStore[email];

//   // Find the user by email
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // Generate access and refresh tokens
//   const tokens = await generateAccessAndRefreshToken(user._id);
//   if (!tokens) {
//     throw new ApiError(500, "Failed to generate tokens");
//   }

//   const { accessToken, refreshToken } = tokens;

//   // Return the response with cookies and the tokens
//   res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiSuccess(200, { user, accessToken, refreshToken }, "Login successful")
//     );
// });


const loginUser = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;
  // console.log(email, password);

  // Validate input
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the password is correct
  const isPasswordCorrect = await user.isPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password mismatched"); // Use 401 for unauthorized access
  }
  // console.log(user,isPasswordCorrect)
  // Generate access and refresh tokens
  const tokens = await generateAccessAndRefreshToken(user._id);
  // console.log("Tokens returned from generateAccessAndRefreshToken:", tokens); // Log tokens

  // Check if tokens are correctly returned
  if (!tokens) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  const { accessToken, refreshToken } = tokens;

  // console.log(data)

  // Fetch the logged-in user excluding sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // Set cookies and send response
  return res
    .status(200) // Corrected from `res(200)`
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiSuccess(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully",
      ),
    );
});


const logout = asyncHandler(async (req, res) => {
  // console.log(req.body)
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiSuccess(200, {}, "User logged out successfully"));
});
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword);
  // console.log(req.user)
  const user = await User.findById(req.user?._id);
  console.log(user);
  const isCorrect = await user.isPassword(oldPassword);
  console.log(isCorrect);
  if (!isCorrect) {
    throw new ApiError(400, "wrong password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiSuccess(200, "password changed successfully"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiSuccess(200, req.user, "User fetched successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  // console.log(incomingRefreshToken)
  // console.log(req.user)
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    if (!decodedToken) {
      throw new ApiError(400, "unauthorized request");
    }
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    console.log(user._id);
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(400, "Invalid refresh Token");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiSuccess(
          200,
          { accessToken, refreshToken },
          "AccessToken is refreshed",
        ),
      );
  } catch (err) {
    throw new ApiError(400, "Invalid Token");
  }
});
// const updateProfilePic = asyncHandler(async (req, res) => {
//   const imagePath = req.file?.path;
//   console.log(imagePath);
//   if (!imagePath) {
//     throw new ApiError(400, "File not found");
//   }
//   const profilePicture = await uploadCloudinary(imagePath);
//   if (!profilePicture.url) {
//     throw new ApiError(400, "Can't upload the profile image ");
//   }
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         profilePicture: profilePicture.url,
//       },
//     },
//     {
//       new: true,
//     },
//   );

//   return res
//     .status(200)
//     .json(new ApiSuccess(200, user, "profile picture updated successfully"));
// });
const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email, phone } = req.body;
  console.log(fullName)
  if (!fullName || !email || !phone) {
    throw new ApiError("fullname,email,phone required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName: fullName,
        email: email,
        phone: phone,
      },
    },
    {
      new: true,
    },
  );
  console.log("Successfully updated the user info");
  return res
    .status(200)
    .json(new ApiSuccess(200, user, "Successfully updated user details"));
});

const getAllUsers = asyncHandler(async(req,res)=>{
  const users = await User.find()
  if(!users){
    throw new ApiError("Users not there");
  }
  return res
    .status(200)
    .json(new ApiSuccess(200, users, "Successfully updated user details"));

})


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saimadhav9235@gmail.com",
    pass: "lxud qyuj mxly rljw",
  },
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const {email} =req.body;
    const user = await User.findOne({email:email});
    console.log(user);

    // If user is not found
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    // email = user.email; 

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    // Email options
    const mailOptions = {
      from: "saimadhav9235@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Error sending email", error });
      }

      // If successful, send a response
      res.status(200).json({ message: "OTP sent successfully" });
    });

    console.log(otpStore);

    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error("Error with transporter:", error);
      } else {
        console.log("Server is ready to send emails:", success);
      }
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const verifyOtp = asyncHandler(async(req,res)=>{
  const {email,otp } = req.body;
  const user=await User.findOne({email})
  if(!user){
    return res.status(404).json({message:"User Not found"})
  }
  const tokens = await generateAccessAndRefreshToken(user._id);
  // console.log("Tokens returned from generateAccessAndRefreshToken:", tokens); // Log tokens

  // Check if tokens are correctly returned
  if (!tokens) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  const { accessToken, refreshToken } = tokens;
  console.log(tokens)
  // email=user.email;
  console.log(email,otp)
  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email]; // OTP can only be used once
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options) 
    .json(new ApiSuccess(200,{
      user:user}, "OTP verified successfully" ));
  }
  else{
    
  return res.status(400).json({ message: "Invalid OTP" });
  }

})

const resetPassword = asyncHandler(async(req,res)=>{
  const {password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  const user=await User.findOne(req.user?._id)
  if(!user){
    return res.status(404).json({message:"User Not found"})
  }

  // const hashedPassword = await bcrypt.hash(password,10);
  user.password = password;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: "Password reset successfully" });

})
const updateUserByAdmin=asyncHandler(async(req,res)=>{
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(data.id, data, { new: true }); // Update and return the updated document

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("hi");
    return res.status(200).json({ message: "updated user", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed at server", err });
  }
})
const deleteUserByAdmin=asyncHandler(async(req,res)=>{
  const data=req.body;
  try{
    const user=await User.findByIdAndDelete(data.id);
    if(!user){
      res.status(404).json({"message":"user not found"});
    }
    res.status(200).json({"message":"deleted",user});

  }catch(err){
    console.log(err);
    res.status(500).json({"message":"internal server error"});
  }
})


export {
  registerUser,
  deleteUserByAdmin,
  loginUser,
  changePassword,
  getCurrentUser,
  logout,
  refreshAccessToken,
  updateUserDetails,
  getAllUsers,
  forgotPassword,
  updateUserByAdmin,
  
  resetPassword,
  
  // updateProfilePic,
};