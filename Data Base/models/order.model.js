import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        title: { type: String, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
    subPrice: {
      type: Number,
      required: true,
    },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumbers: String,
    orderStatus: {
      type: String,
      required: true,
      enum: [
        "placed",
        "waitPayment",
        "delieverd",
        "onWay",
        "cancelled",
        "Rejected",
      ],
      default: "placed",
    },
    paymentMethod: { type: String, required: true, enum: ["card", "cash"] },

    paidAmount: { type: Number },
    cancelledBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: { type: String },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
