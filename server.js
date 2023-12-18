import express from "express";
import { dbConnect } from "./config/dbCOnnect.js";
import authRouter from "./routes/authRouter.js";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

dbConnect();

app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
