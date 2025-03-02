import { asyncHandler } from "../asyncHandler.js";
import { Admin } from "../models/Admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import jwt from "jsonwebtoken";
const options = {
  httpOnly: true,
  secure: false, // In development, no HTTPS
  sameSite: "None", // Allows same-site requests, suitable for development
  path: "/", // Ensure this matches how the cookie was originally set
};

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const admin = await Admin.findById(userID);
    //   console.log(admin);
    const accessToken = admin.generateAccessToken();
    //   console.log(accessToken);

    const refreshToken = admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    // console.log(user.refreshToken)
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens",
    );
  }
};
const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);

  // Validate input fields
  if ([fullName, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the admin already exists
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new ApiError(400, "Admin already exists");
    }
  } catch (err) {
    throw new ApiError(500, "Error finding admin", err);
  }

  // Create the new admin
  const newAdmin = await Admin.create({
    fullName,
    email,
    password,
  });

  // Exclude sensitive fields (e.g., password) in the response
  const adminCreated = await Admin.findById(newAdmin._id).select(
    "-password -refreshToken",
  );
  if (!adminCreated) {
    throw new ApiError(500, "Admin not created");
  }

  return res
    .status(201)
    .json(new ApiSuccess(201, adminCreated, "Admin registered successfully"));
});
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Find the admin by email
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Check if the password is correct
  const isPasswordCorrect = await admin.isPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password mismatched"); // Unauthorized access
  }

  // Generate access and refresh tokens
  const tokens = await generateAccessAndRefreshToken(admin._id);

  // Check if tokens are correctly returned
  if (!tokens) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  const { accessToken, refreshToken } = tokens;

  // Fetch the logged-in admin excluding sensitive fields
  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken",
  );
  // console.log(loggedInAdmin);

  // Set cookies and send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiSuccess(
        200,
        {
          admin: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        "Admin logged in successfully",
      ),
    );
});
const logoutAdmin = asyncHandler(async (req, res) => {
  // Clear refreshToken from the database
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  // Clear cookies and send response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiSuccess(200, {}, "Admin logged out successfully"));
});
const changeAdminPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Fetch the admin by their ID
  const admin = await Admin.findById(req.admin?._id);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Verify the old password
  const isCorrect = await admin.isPassword(oldPassword);
  if (!isCorrect) {
    throw new ApiError(400, "Wrong password");
  }

  // Update the password
  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiSuccess(200, "Password changed successfully"));
});
const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiSuccess(200, req.admin, "Admin fetched successfully"));
});
const refreshAdminAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    if (!decodedToken) {
      throw new ApiError(400, "Unauthorized request");
    }

    // Find the admin associated with the token
    const admin = await Admin.findById(decodedToken._id);
    if (!admin) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Validate the refresh token
    if (incomingRefreshToken !== admin.refreshToken) {
      throw new ApiError(400, "Invalid refresh token");
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      admin._id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiSuccess(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully",
        ),
      );
  } catch (err) {
    throw new ApiError(400, "Invalid token");
  }
});
const updateAdminDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log(req.body);

  // Validate required fields
  if (!fullName || !email) {
    throw new ApiError("Full name and email are required");
  }

  // If password is provided, hash it
  let updatedFields = { fullName, email };
  // if (password) {
  //   const hashedPassword = await bcrypt.hash(password, 12); // Hash the new password
  //   updatedFields.password = hashedPassword; // Include the hashed password if provided
  // }

  // Update the admin details in the database
  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: updatedFields,
    },
    {
      new: true,
    },
  );

  if (!updatedAdmin) {
    throw new ApiError("Admin not found or failed to update");
  }

  console.log("Successfully updated the admin info");

  // Return success response
  return res
    .status(200)
    .json(
      new ApiSuccess(200, updatedAdmin, "Successfully updated admin details"),
    );
});


export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  updateAdminDetails,
  changeAdminPassword,
  refreshAdminAccessToken,
};
