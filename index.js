import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import express from "express";
import connectionDb from "./Data Base/connection.js";
import * as routers from "./src/modules/index.routes.js";
import AppError from "./src/utilis/errorClass.js";
import deleteFromCloudinary from "./src/utilis/deleteFromCloudinary.js";
import globalErrorHandling from "./src/utilis/globalErrorHandling.js";
import cors from "cors";

connectionDb();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl == "/order/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.get("/", (req, res) => res.send("Hello to my Ecommerce project"));

app.use("/user", routers.userRouter);
app.use("/category", routers.categoryRouter);
app.use("/brand", routers.brandRouter);
app.use("/product", routers.productRouter);
app.use("/subCategory", routers.subCategoryRouter);
app.use("/coupon", routers.couponRouter);
app.use("/cart", routers.cartRouter);
app.use("/order", routers.orderRouter);
// app.use("/review", routers.reviewRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`invalid url  : ${req.originalUrl}`, 404));
});

app.use(globalErrorHandling, deleteFromCloudinary);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
