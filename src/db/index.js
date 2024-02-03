import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`DB Connected!! DB Host: ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("MONGODB connection failed: ", error);
        //node js gives you the access of 'process' which refers to the current application(your current application must be running on some process and this 'process' is the reference to it)
        process.exit(1);
    }
}

export default connectDB