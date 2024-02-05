import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      //if you want to make any field searchable in database you can set its index as true
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
//here in tha callback , we dont write the arrow functions since they dont know about context i.e. they dont have the reference of this and here we will need this so use function instead
userSchema.pre("save", async function (next) {
  //but we only want to run this code when there is some modification in the password and not everytime we update and save something
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//adding custom method isPasswrordCorrect
userSchema.methods.isPasswordCorrect = async function (password) {
  //bcrypt can also check our password
  return await bcrypt.compare(password, this.password);
};

//custom method
userSchema.methods.generateAccessToken = function () {
  //Synchronously sign the given payload into a JSON Web Token string payload
  return jwt.sign(
    {
      _id: this._id, //this id is fetched from mongodb
      email: this.email, //this email is fetched from mongodb
      username: this.username, //this username is fetched from mongodb
      fullname: this.fullname, //this fullname is fetched from mongodb
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//custom method
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, //this id is fetched from mongodb
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
