import AppError from "../../utilis/errorClass.js";
import ProductModel from "../../../Data Base/models/product.model.js";
import listModel from "../../../Data Base/models/wishList.model.js";

export const createWishList = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const productExist = await ProductModel.findById(productId);
  if (!productExist) throw new AppError("product not exist");

  let wish = await listModel.findOneAndUpdate(
    { userId },
    { $addToSet: { products: productId } }
  );

  if (!wish) {
    wish = await listModel.create({
      userId,
      products: [ productId ],
    });
  }

  return res.status(200).json({ msg: "done", wish });
};
export const removeWishList = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const productExist = await ProductModel.findById(productId);
  if (!productExist) throw new AppError("product not exist");

  let wish = await listModel.findOneAndUpdate(
    { userId },
    { $pull: { products: productId } }
  );

  if (!wish) {
    wish = await listModel.create({
      userId,
      products: [ productId ],
    });
  }

  return res.status(200).json({ msg: "done", wish });
};
