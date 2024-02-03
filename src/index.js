// require("dotenv").config({ path: "../.env" });

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "../.env" });

connectDB();

















//approach 1
// const app = express();
//iife
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     //database is connected but there is some error within the app that are app is unable to talk to database
//     app.on("errror", error => {
//       console.log("Errr: ", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("error: ", error);
//     throw error;
//   }
// })();

//approach2
