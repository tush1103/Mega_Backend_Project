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

app.use(express.static("public"));

app.use(cookieParser());

export { app };
