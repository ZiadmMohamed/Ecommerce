import slugify from "slugify";
import SubCategoryModel from "../../../Data Base/models/subCategory.model.js";
import cloudinary from "../../services/cloudinary.js";
import AppError from "../../utilis/errorClass.js";
import { nanoid } from "nanoid";
import Category from "../../../Data Base/models/category.model.js";
import ProductModel from "../../../Data Base/models/product.model.js";
import Brand from "../../../Data Base/models/brand.model.js";
import ApiFeatures from "../../utilis/apiFeatures.js";
import Order from "../../../Data Base/models/order.model.js";

export const createproduct = async (req, res, next) => {
  const {
    title,
    desc,
    categoryId,
    subCategoryId,
    brandId,
    price,
    discount,
    stock,
  } = req.body;
  const user = req.user;
  const priceNumber = parseInt(price);
  const discountNumber = parseInt(discount) || 0;

  const Product = await ProductModel.findOne({ title });
  if (Product) new AppError("Product is already exist");

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("category is not exist ");
  }

  const subCategory = await SubCategoryModel.findById(subCategoryId);
  if (!subCategory) {
    throw new AppError("subCategory is not exist ");
  }

  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new AppError("brand is not exist");
  }

  const productCustomId = nanoid(5);

  const List = [];
  for (const file of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `Ecommerce/categories/${category.customId}/categories/${subCategory.subCustomId}/products/${productCustomId}/coverimages`,
      }
    );
    List.push({ secure_url, public_id });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `Ecommerce/categories/${category.customId}/categories/${subCategory.subCustomId}/products/${productCustomId}/mainimage`,
    }
  );
  const data = await ProductModel.create({
    title,
    desc,
    slug: slugify(title, {
      replacement: "-",
      lower: true,
    }),
    image: { secure_url, public_id },
    image: List,
    addedBy: user._id,
    categoryId,
    subCategoryId,
    brandId,
    productCustomId,
    price: priceNumber,
    discount: discountNumber,
    priceAfterDiscount: priceNumber - (priceNumber * discountNumber) / 100,
    stock,
  });

  data
    ? res.status(200).json({ msg: "done", data })
    : new AppError("category not created");
};

export const getAllproducts = async (req, res, next) => {
  const features = new ApiFeatures(ProductModel.find(), req.query).pagination();

  if (req.query.sort) features.sort();

  if (req.query.select) features.select();

  if (req.query.search) features.search();

  const products = await features.mongooseQuery;

  return res.status(200).json({ msg: "done", page: features.page, products });
};

export const updateProduct = async (req, res, next) => {
  // return res.status(200).json({ msg: "test", Product });
  const {
    title,
    desc,
    categoryId,
    subCategoryId,
    brandId,
    price,
    discount,
    stock,
  } = req.body;
  const { id } = req.params;
  const user = req.user;

  // const priceNumber = parseInt(price);
  // const discountNumber = parseInt(discount);

  const Product = await ProductModel.findOne({ _id: id, addedBy: user._id });
  if (!Product) throw new AppError("product not exist");

  const category = await Category.findById(categoryId);
  if (!category) throw new AppError("category is not exist ");

  const subCategory = await SubCategoryModel.findById(subCategoryId);
  if (!subCategory) throw new AppError("subCategory is not exist ");

  const brand = await Brand.findById(brandId);
  if (!brand) throw new AppError("brand is not exist");

  if (title) {
    if (title.toLowerCase == Product.title)
      throw new AppError("title is matching with old title");

    if (await ProductModel.findOne({ title: title.toLowerCase }))
      throw new AppError("title is already exist");

    Product.title = title;
    Product.slug = slugify(title, {
      replacement: "-",
      lower: true,
    });
  }

  if (stock) Product.stock += stock;
  if (desc) Product.desc = desc;

  if (price && discount) {
    Product.priceAfterDiscount = price - (price * discount) / 100;
    Product.price = price;
    Product.discount = discount;
  } else if (price) {
    Product.price = price;
  } else if (discount) {
    Product.discount = discount;
    Product.priceAfterDiscount =
      Product.price - (Product.price * discount) / 100;
  }

  if (req.files) {
    if (req.files?.image?.length) {
      if (req.files?.image?.length && Product.image?.public_id) {
        await cloudinary.uploader.destroy(Product.image.public_id);
      }

      const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `Ecommerce/categories/${category.customId}/categories/${subCategory.subCustomId}/products/${Product.customId}/mainimage`,
        }
      );

      Product.image = { public_id, secure_url };
    }

    if (req.files?.images?.length) {
      const List = [];
      await cloudinary.api.delete_resources_by_prefix(
        `Ecommerce/categories/${category.customId}/categories/${subCategory.subCustomId}/products/${Product.customId}/coverimages`
      );

      for (const file of req.files.images) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `Ecommerce/categories/${category.customId}/categories/${subCategory.subCustomId}/products/${Product.customId}/coverimages`,
          }
        );

        List.push({ secure_url, public_id });
      }

      Product.images = List;
    }
  }

  await Product.save();

  return res.status(200).json({ msg: "done", Product });
};


export const returnProduct = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const product = await ProductModel.findById(id);
  if (!product) throw new AppError("Product does not exist", 404);

  const userOrder = await Order.findOne({ userId: user._id });
  if (!userOrder) throw new AppError("You don't have any orders", 400);

  const orderWithProduct = await Order.findOne({ "products.productId": id });
  if (!orderWithProduct)
    throw new AppError("Product not found in any order", 400);

  await Order.updateMany(
    { userId: user._id, "products.productId": id },
    { $pull: { products: { productId: id } } }
  );

  return res.status(200).json({ msg: "Product removed from orders", product });
};

