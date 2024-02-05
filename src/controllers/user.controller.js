import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  const existingUser = User.findOne({
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
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = uploadOnCloudinary(avatarLocalPath);
  const cloverImage = uploadOnCloudinary(coverImageLocalPath);

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
  const createdUser=await User.findById(user._id).select(
    //kya kya nahi chahiye
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
  )

});
export { registerUser };
