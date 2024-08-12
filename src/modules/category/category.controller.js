import slugify from "slugify";
import Category from "../../../Data Base/models/category.model.js";
import cloudinary from "../../services/cloudinary.js";
import AppError from "../../utilis/errorClass.js";
import { nanoid } from "nanoid";
import SubCategoryModel from "../../../Data Base/models/subCategory.model.js";

export const createCategory = async (req, res, next) => {
  const { name } = req.body;

  const user = req.user;

  const category = await Category.findOne({ name });
  if (category) new AppError("category is already exist");

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/categories/${customId}`,
    }
  );
  req.filePath = `Ecommerce/categories/${customId}`;
  const data = await Category.create({
    name,
    slug: slugify(name, {
      replacement: "-",
      lower: true,
    }),
    image: { secure_url, public_id },
    addedBy: user._id,
    customId,
  });

  data
    ? res.status(200).json({ msg: "done", data })
    : new AppError("category not created");
};

export const getCategories = async (req, res, next) => {
  const categories = await Category.find({}).populate("subCategories");
  if (!categories.length) new AppError("there is no categories");

  // const List = [];
  // for (const category of categories) {
  //   const subCategories = await SubCategoryModel.find({
  //     categoryId: category._id,
  //   });
  //   const newCategory = category.toObject();
  //   newCategory.subCategories = subCategories;
  //   List.push(newCategory);
  // }

  return res.status(200).json({ msg: "done", categories });
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findOne({ _id: id, addedBy: req.user._id });
  if (!category) throw new AppError("category not exist");

  if (name) {
    if (name == category.name) new AppError("the name should be diffrent");

    if (await Category.findOne({ name })) {
      throw new AppError("the name is't availble change it");
    }
    category.name = name;
    category.slug = slugify(name);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/categories/${category.customId}`,
      }
    );

    category.image = { secure_url, public_id };
  }

  await category.save();
  return res.status(200).json({ msg: "done", category });
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOneAndDelete({
    _id: id,
    addedBy: req.user._id,
  });
  if (!category)
    throw new AppError("category not exist or you don't have a permission");

  await cloudinary.api.delete_resources_by_prefix(
    `Ecommerce/categories/${category.customId}`
  );
  await cloudinary.api.delete_folder(
    `Ecommerce/categories/${category.customId}`
  );

  await SubCategoryModel.deleteMany({ categoryId: category._id });

  return res.status(200).json({ msg: "done", category });
};
