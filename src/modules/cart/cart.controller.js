import AppError from "../../utilis/errorClass.js";
import ProductModel from "../../../Data Base/models/product.model.js";
import Cart from "../../../Data Base/models/cart.model.js";
import { ObjectId } from "mongoose";

export const createCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const user = req.user;

  const Product = await ProductModel.findById(productId);
  if (!Product) throw new AppError("Product is not exist");

  if (quantity > Product.stock)
    throw new AppError("the stock quantity is not enogh");

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    const newCart = await Cart.create({
      userId: user._id,
      products: [{ productId, quantity }],
    });
    return res.status(200).json({ msg: "cart created succesfuly", newCart });
  }
  let flag = false;
  for (const product of cart.products) {
    if (productId == product.productId) {
      product.quantity = quantity;

      flag = true;
    }
  }
  if (!flag) {
    const cart = await Cart.updateOne(
      { userId: user._id },
      { $push: { products: { productId, quantity } } }
    );
  }

  await cart.save();
  return res.status(200).json({ msg: "cart updated successfuly", cart });
};

export const removeProduct = async (req, res, next) => {
  const { productId } = req.params;
  const user = req.user;

  const cart = await Cart.findOneAndUpdate(
    {
      userId: user._id,
      "products.productId": productId,
    },
    {
      $pull: { products: { productId } },
    },
    { new: true }
  );
  if (!cart) throw new AppError("there is no  peoduct with this id");

  return res.status(200).json({ msg: "don", cart });
};
export const clearCart = async (req, res, next) => {
  const user = req.user;

  const cart = await Cart.findOneAndUpdate(
    {
      userId: user._id,
    },
    {
      products: [],
    }
  );
  if (!cart) throw new AppError("you don't have a cart");

  return res.status(200).json({ msg: "done", cart });
};

export const deleteCart = async (req, res, next) => {
  const user = req.user;

  const cart = await Cart.findOneAndDelete({ userId: user._id });
  if (!cart) throw new AppError("there is no  peoduct with this id");

  return res.status(200).json({ msg: "done", cart });
};
