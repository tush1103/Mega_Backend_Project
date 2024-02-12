import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async userId => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    //access token to hum user ko de dete hai lekin refresh token hu database ko bhi dete hai taaki baar baar password na puchna pde user se

    user.refreshToken = refreshToken; //database ko refresh token de diya
    await user.save({ validateBeforeSave: false });
    //yaha humne user ko save sirf ek field(refresh token ) dekr kra diya database mei but hme sbhi fields deni hoti hai jo bhi schema mei hai jse username password etc. isliye hum yaha pe validation false kr dete hai

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend(postman)
  //validation-not empty
  //check if user already exists-through email,username
  //check for images,check for avatar
  //upload them to cloudinary,avatar
  //create user object-create entry in database
  //remove password and refresh token field
  //check for user creation
  //if created return response
  console.log("req body", req.body);
  const { fullname, email, password, username } = req.body;

  if (
    [email, fullname, password, username].some(field => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("existing user ", existingUser);
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  //like express gives us acess to body through req.body, similarly multer gives us access to files through req.files
  //ye hme path de dege jaha bhi multer ne file ko hmari local storage mei rkha hai
  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  )
    coverImageLocalPath = req.files.coverImage[0].path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const cloverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  const user = await User.create({
    fullname: fullname,
    avatar: avatar.url,
    coverImage: cloverImage?.url || "",
    email: email,
    password: password,
    username: username.toLowerCase(),
  });

  //to check if user is created or not
  const createdUser = await User.findById(user._id).select(
    //kya kya nahi chahiye
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req.body->data
  //username or email
  //find user
  //password check
  //access and refresh token
  //send cookies

  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  //create access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //saamne vale ko kon konsi details bhejni hai user ki vo lelo,though we dont want to send the password and refresh token to user
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //now your cookies will only be modifiable by server
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User loggedin successfully"
      )
    ); //ye voh case hai jb user khud access token or refresh token ko save krna chahta ho for eg in local storage
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } }, //ye humne database se refreshtoken ko hta diya
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options) //yaha hum user se cookies hta rhe hai
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
