import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    //kon konse frontend se aap request accept kr skte ho
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); 

//sirf itna hi json hum accept krenge
app.use(express.json({ limit: "16kb" }));

//if we are receiving data from url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//here extended means you can give nested objects

//sometimes we want so store some files, folders,css files,js files,images like some pdf,images etc in our own server,here public is the folder where we will keep all these files and folders
//static files dont change when your application is running ,these files are files that clients download as they are from the server.
app.use(express.static("public"));

//cookie parser is used so that using my server I can access and set the cookies of the user's browser
//only  server can read or remove these secure cookies
app.use(cookieParser());

export { app };
