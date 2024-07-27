import dotenv from "dotenv";
dotenv.config({ path: "./src/utilis/.env" });
import express from "express";
import connectionDb from "./Data Base/connection.js";
import * as routers from "./src/modules/index.routes.js";
import AppError from "./src/utilis/errorClass.js";

const app = express();
const port = 3000;
app.use(express.json());

app.use("/user", routers.userRouter);

connectionDb();
app.get("/", (req, res) => res.send("Hello World!"));
app.use("*", (req, res, next) => {
  next(new AppError(`invalid url  : ${req.originalUrl}`, 404));
});
app.use((err, req, res) => {
  res
    .status(err.statusCode || 500)
    .json({ msg: `Catch error: ${err.message}` });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
