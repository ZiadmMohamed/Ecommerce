import AppError from "../../utilis/errorClass.js";
import ProductModel from "../../../Data Base/models/product.model.js";
import Cart from "../../../Data Base/models/cart.model.js";
import Order from "../../../Data Base/models/order.model.js";
import Coupon from "../../../Data Base/models/coupones.model.js";
import createInvoice from "../../services/createInvoice.js";
import { sendEmail } from "../../services/sendEmail.js";

export const createOrder = async (req, res, next) => {
  const {
    productId,
    quantity,
    couponCode,
    address,
    phoneNumbers,
    paymentMethod,
  } = req.body;

  const user = req.user;
  let products = [];

  let discount = 0;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOneAndUpdate(
      {
        couponCode,
        usedBy: { $nin: [user._id] },
        toDate: { $gte: new Date() },
      },
      { $push: { usedBy: user._id } },
      { new: true }
    );

    if (!coupon) {
      throw new AppError("Coupon does not exist or has expired");
    }
    discount = coupon.Amount;
  }

  let flag = false;

  if (productId) {
    const product = await ProductModel.findOne({
      _id: productId,
      stock: { $gt: quantity },
    });

    if (!product)
      throw new AppError("the product OR the quantity is't availble ");

    products.push({ productId, quantity });
  } else {
    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || !cart.products.length)
      throw new AppError("cart is't exist or  embty");

    products = cart.products;
    flag = true;
  }

  let subPrice = 0;
  let finalProducts = [];

  for (const product of products) {
    let productData = await ProductModel.findById(product.productId);

    let productTotalPrice = productData.priceAfterDiscount * product.quantity;
    subPrice += productTotalPrice;

    finalProducts.push({
      productId: product.productId,
      quantity: product.quantity,
      price: productData.price,
      title: productData.title,
      finalPrice: productData.priceAfterDiscount,
      total: productTotalPrice,
    });
    await ProductModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  let total_Price = subPrice - (subPrice * discount) / 100;

  const order = await Order.create({
    userId: user._id,
    couponId: coupon ? coupon._id : null,
    totalPrice: total_Price,
    products: finalProducts,
    subPrice: subPrice,
    phoneNumbers,
    address,
    paymentMethod,
    orderStatus: paymentMethod == "cash" ? "placed" : "waitPayment",
  });

  if (flag) await Cart.updateOne({ userId: user._id }, { products: [] });

  const invoice = {
    shipping: {
      name: user.username,
      address: "egypt",
      city: "cairo",
      state: "CA",
      country: "US",
      postal_code: 94111,
    },
    items: order.products,
    subtotal: order.subPrice,
    paid: 0,
    invoice_nr: order._id,
    date: order.createdAt,
  };
  createInvoice(invoice, "invoice.pdf");
  sendEmail(user.email, "hi this is pdf", "<h1>hello</h1>", [
    {
      path: "invoice.pdf",
      contentType: "applicaton/pdf",
    },
    {
      path: "logo.jpg",
      contentType: "image/jpg",
    },
  ]);

  return res.status(200).json({ msg: "done", order });
};

export const cancelOrder = async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = req.user;

  const order = await Order.findOne({ _id: id, userId: user._id });
  if (!order) throw new AppError("there is no orders");

  if (
    (order.paymentMethod == "cash" && order.orderStatus != "placed") ||
    (order.paymentMethod == "card" && order.orderStatus != "waitPayment")
  )
    throw new AppError("you cannot cancel this order", 404);

  if (order.couponId) {
    await Coupon.updateOne(
      {
        _id: order.couponId,
      },
      { $pull: { usedBy: user._id } }
    );
  }

  for (const product of order.products) {
    await ProductModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: product.quantity } }
    );
  }

  await Order.updateOne(
    { _id: id },
    {
      status: "cancelled",
      reason: reason,
    }
  );

  return res.status(200).json({ msg: "order cancceled succesfuly", order });
};

