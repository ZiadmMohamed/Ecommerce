import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    slug: { type: String, required: true, unique: true },
    image: { secure_url: String, public_id: String },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customId: String,
  },
  {
    timeseries: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

categorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "categoryId",
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
