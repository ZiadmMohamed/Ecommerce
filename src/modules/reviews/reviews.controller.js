import Order from "../../../Data Base/models/order.model.js";
import ProductModel from "../../../Data Base/models/product.model.js";
import reviewModel from "../../../Data Base/models/review.model.js";
import AppError from "../../utilis/errorClass.js";

export const addReview = async (req, res, next) => {
  const { comment, rate } = req.body;
  const { productId } = req.params;
  const user = req.user;

  const product = await ProductModel.findById(productId);
  if (!product) throw new AppError("product not found");

  const review = await reviewModel.findOne({ userId: user._id, productId });
  if (review) throw new AppError("user is already reviewed in this product");

  const userOrders = await Order.findOne({
    userId: user._id,
    "products.productId": productId,
    orderStatus: "delieverd",
  });
  if (!userOrders)
    throw new AppError("user don't have orders or didn't order this product");

  const newReview = await reviewModel.create({
    comment,
    rate,
    productId,
    userId: user._id,
  });

  const reviews = await reviewModel.find({ productId });

  let sum = 0;
  for (const productReview of reviews) {
    sum += productReview.rate;
  }

  product.avgRating = sum / reviews.length;
  await product.save();

  return res.status(200).json({ msg: "dome", newReview });
};

export const delReview = async (req, res, next) => {
  const { productId } = req.params;
  const { reviewId } = req.body;
  const user = req.user;

  const review = await reviewModel.findOneAndDelete({
    _id: reviewId,
    productId,
    userId: user._id,
  });
  if (!review) throw new AppError("you don't have any reviews");

  const product = await ProductModel.findById(productId);

  const reviews = await reviewModel.find({ productId });

  let sum = 0;
  for (const productReview of reviews) {
    sum += productReview.rate;
  }

  product.avgRating = reviews.length > 0 ? sum / reviews.length : 0;
  await product.save();

  return res.status(200).json({ msg: "review deleted sucssefuly", review });
};
