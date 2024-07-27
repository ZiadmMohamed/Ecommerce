import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
  subTotal: { type: Number, required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  paidAmount: { type: Number, required: true },
  address: { type: String, required: true },
  phoneNumbers: [String],
  orderStatus: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cancelledBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String },
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Order = mongoose.model("Order", orderSchema);
