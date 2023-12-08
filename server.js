import express from "express";
import { dbConnect } from "./config/dbCOnnect.js";
import authRouter from "./routes/authRouter.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dbConnect();

app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
