//files aengi file system ke through mtlb server pr already upload ho gai hai kse upload hui hai abhi usse mtlb nahi but ye koi bhi service use krega to local file(jo server pr aa chuki hai) ka path dega,agr file successfully upload ho gai hai cloudinary pr to use hum local server se remove kr denge

//hmare file system mei files link or unlink hoti hai mtlb for eg if hmne koi file remove ki hai to vo file system se unlink ho jaegi lekin memory mei vo file abhi bhi exist kr rahi hai mtlb the file is untouched, it is simply unlinked from the file system

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) {
      return null;
    }
    //upload the file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully
    console.log("file is uploaded successfully ", res.url); //upload hone ke baad jo public url hai vo hme yaha mil jaega
    return res;
  } catch (error) {
    //if an error comes, we should remove the file from the server too as otherwise corrupted files will remain on the server
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file
    return null;
  }
};

export { uploadOnCloudinary };
