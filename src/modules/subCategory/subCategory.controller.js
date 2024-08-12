import slugify from "slugify";
import SubCategoryModel from "../../../Data Base/models/subCategory.model.js";
import cloudinary from "../../services/cloudinary.js";
import AppError from "../../utilis/errorClass.js";
import { nanoid } from "nanoid";
import Category from "../../../Data Base/models/category.model.js";

export const createsubCategory = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  const user = req.user;

  const category = await Category.findOne({
    _id: categoryId,
    addedBy: user._id,
  });
  if (!category) new AppError("category is not exist");

  const subCategory = await SubCategoryModel.findOne({ name });
  if (subCategory) new AppError("subCategory is already exist");

  const subCustomId = nanoid(5);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/categories/${category.customId}/categories/${subCustomId}`,
    }
  );
  const data = await SubCategoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "-",
      lower: true,
    }),
    image: { secure_url, public_id },
    addedBy: user._id,
    categoryId,
    subCustomId,
  });

  data
    ? res.status(200).json({ msg: "done", data })
    : new AppError("category not created");
};

export const updateSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const SubCategory = await SubCategoryModel.findOne({
    _id: id,
    addedBy: req.user._id,
  }).populate("categoryId");

  if (!SubCategory) throw new AppError("category not exist");

  if (name) {
    if (name == SubCategoryModel.name)
      new AppError("the name should be diffrent");

    if (await SubCategoryModel.findOne({ name })) {
      throw new AppError("the name is't availble change it");
    }
    SubCategory.name = name;
    SubCategory.slug = slugify(name);
  }
  const customSubCategory = nanoid(5);
  if (req.file) {
    await cloudinary.uploader.destroy(SubCategory.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/categories/${SubCategory.categoryId.customId}/subCategories/${SubCategory.customSubCategory}`,
      }
    );

    SubCategory.image = { secure_url, public_id };
  }

  await SubCategory.save();
  return res.status(200).json({ msg: "done", SubCategory });
};

export const getSpicificSubCategories = async (req, res, next) => {
  const { categoryId } = req.params;
  const user = req.user;

  const category = await Category.findOne({
    _id: categoryId,
    addedBy: user._id,
  });
  if (!category) {
    throw new AppError("category is not exist");
  }

  const subCategory = await SubCategoryModel.find({
    categoryId: category._id,
  });
  if (!subCategory.length) new AppError("subCategory is not exist");

  return res.status(200).json({ msg: "done", subCategory });
};

export const getAllSubCategories = async (req, res, next) => {
  const subCategories = await SubCategoryModel.find({});

  if (!subCategories.length) new AppError("there is npo subCategories");

  return res.status(200).json({ msg: "done", subCategories });
};
