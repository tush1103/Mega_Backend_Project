//ye veerify krega ki user hai ya nahi hai

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT=asyncHandler(async(req,_,next) =>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError (401,"Unauthorized request")
        }
    
        const decodedInfo=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log('decoded info : ',decodedInfo);
    
        const user=await User.findById(decodedInfo?._id).select("-password -refreshToken")
    
        if(!user){
            //TODO:discuss about frontend
            throw new ApiError(401,"Invalid access token")
        }
    
        //request ke andr new object add kr dete hai
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})