import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rate: { type: Number, required: true, min: 0, max: 5 },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);
