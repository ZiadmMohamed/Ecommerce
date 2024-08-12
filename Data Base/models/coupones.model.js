import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: { type: String, unique: true, required: true },
  Amount: {
    type: Number,
    min: 1,
    max: 100,
    required: [true, "amount is required"],
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  fromDate: {
    type: Date,
    required: [true, "fromDate is required"],
  },
  toDate: {
    type: Date,
    required: [true, "toDate is required"],
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
