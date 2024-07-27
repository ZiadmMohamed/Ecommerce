import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  images: [{ secure_url: String, public_id: String }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  price: { type: Number, required: true },
  appliedDiscount: { type: Number, default: 0 },
  priceAfterDiscount: { type: Number },
  stock: { type: Number, required: true },
  avgRating: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);
