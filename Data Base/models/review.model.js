import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate: { type: Number, required: true, min: 1, max: 5 },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
