import slugify from "slugify";
import SubCategoryModel from "../../../Data Base/models/subCategory.model.js";
import cloudinary from "../../services/cloudinary.js";
import AppError from "../../utilis/errorClass.js";
import { nanoid } from "nanoid";
import Category from "../../../Data Base/models/category.model.js";
import Coupon from "../../../Data Base/models/coupones.model.js";

export const createCoupon = async (req, res, next) => {
  const { Amount, toDate } = req.body;
  const user = req.user;

  const Code = nanoid(11);

  const coupon = await Coupon.findOne({ Code });
  if (coupon) return new AppError("coupon is already exist");

  if (!Amount || typeof Amount !== "number" || Amount <= 0) {
    return next(new AppError("Invalid amount provided", 400));
  }

  if (new Date() > new Date(toDate)) {
    throw new AppError(`the date must be greater then ${new Date()}`);
  }

  const data = await Coupon.create({
    Amount,
    couponCode: Code,
    addedBy: user._id,
    fromDate: new Date(),
    toDate,
  });

  data
    ? res.status(200).json({ msg: "done", data })
    : new AppError("coupon not created");
};

export const updateCoupon = async (req, res, next) => {
  const { id } = req.params;
  const { Amount, toDate } = req.body;

  const coupon = await Coupon.findOneAndUpdate(
    {
      _id: id,
      addedBy: req.user._id,
    },
    { Amount, toDate },
    { new: true }
  );

  if (!coupon)
    throw new AppError("coupon not exist or you don't have a permission");

  return res.status(200).json({ msg: "done", coupon });
};

export const getSpicificCoupon = async (req, res, next) => {
  const { categoryId } = req.params;
  const user = req.user;

  const category = await Category.findOne({
    _id: categoryId,
    addedBy: user._id,
  });
  if (!category) new AppError("category is not exist");

  const subCategory = await SubCategoryModel.find({
    categoryId: category._id,
  });
  if (!subCategory.length) new AppError("subCategory is not exist");

  return res.status(200).json({ msg: "done", subCategory });
};

export const getAllCoupons = async (req, res, next) => {
  const subCategories = await SubCategoryModel.find({});

  if (!subCategories.length) new AppError("there is npo subCategories");

  return res.status(200).json({ msg: "done", subCategories });
};
