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
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
//app.get tb use krte hai agr humne routes alg se na likhe ho but hmne yaha routes alg se likhe hai to routes ko laane ke liye hme middleware use krna pdega isliye we will use app.use()
app.use("/api/v1/users", userRouter);


export { app };
