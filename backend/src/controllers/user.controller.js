import { asyncHandler } from "../asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { promises as fs } from "fs";
import jwt from "jsonwebtoken";
const options = {
  httpOnly: true,
  secure: true,
  sameSite: 'none', // Allows same-site requests, suitable for development
};
// const options = {
//   httpOnly: true,
//   secure: false, // In development, no HTTPS
//   sameSite: 'lax', // Allows same-site requests, suitable for development
//   path: '/', // Ensure this matches how the cookie was originally set
// };

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
  const { email, fullName, password, phone, gender } = req.body;
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


  // Proceed with the rest of the logic, using `profilePicture` as `null` if no picture was uploaded.

  const user = await User.create({
    fullName,
    email,
    password,
    phone,
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
  console.log(loggedInUser)

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

export {
  registerUser,
  loginUser,
  changePassword,
  getCurrentUser,
  logout,
  refreshAccessToken,
  updateUserDetails,
  getAllUsers
  // updateProfilePic,
};
