import slugify from "slugify";
import Brand from "../../../Data Base/models/brand.model.js";
import cloudinary from "../../services/cloudinary.js";
import AppError from "../../utilis/errorClass.js";
import { nanoid } from "nanoid";
import SubCategoryModel from "../../../Data Base/models/subCategory.model.js";

export const createBrand = async (req, res, next) => {
  const { name, subCategoryId } = req.body;
  const user = req.user;

  const subCategory = await SubCategoryModel.findOne({
    _id: subCategoryId,
    addedBy: user._id,
  });
  if (!subCategory) {
    throw new AppError("no subCategories with this id");
  }

  const brand = await Brand.findOne({ name });
  if (brand) {
    throw new AppError("brand is already exist");
  }

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/brands/${customId}`,
    }
  );

  const data = await Brand.create({
    name,
    slug: slugify(name, {
      replacement: "-",
      lower: true,
    }),
    image: { secure_url, public_id },
    addedBy: user._id,
    subCategoryId,
    categoryId: subCategory.categoryId,
    customId,
  });

  data
    ? res.status(200).json({ msg: "done", data })
    : new AppError("brand not created");
};

export const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findOne({ _id: id, addedBy: req.user._id });
  if (!brand) {
    throw new AppError("brand not exist");
  }

  if (name) {
    if (name == brand.name) {
      throw new AppError("the name should be diffrent");
    }

    if (await Brand.findOne({ name })) {
      throw new AppError("the name is't availble change it");
    }
    brand.name = name;
    brand.slug = slugify(name);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/brands/${brand.customId}`,
      }
    );

    brand.image = { secure_url, public_id };
  }

  await brand.save();
  return res.status(200).json({ msg: "done", brand });
};
