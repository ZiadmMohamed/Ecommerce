import AppError from "../../utilis/errorClass.js";
import ProductModel from "../../../Data Base/models/product.model.js";
import Cart from "../../../Data Base/models/cart.model.js";
import Order from "../../../Data Base/models/order.model.js";
import Coupon from "../../../Data Base/models/coupones.model.js";
import createInvoice from "../../services/createInvoice.js";
import { sendEmail } from "../../services/sendEmail.js";
import payment from "../../utilis/payment.js";
import Stripe from "stripe";
import getRawBody from "raw-body";
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
        // usedBy: { $nin: [user._id] },
        toDate: { $gte: new Date() },
      },
      { $push: { usedBy: user._id } }
    );

    if (!coupon) {
      throw new AppError("Coupon does not exist or has expired");
    }
    discount = coupon.Amount;
    req.body.coupon = coupon;
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

  if (paymentMethod == "card") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (req?.body?.coupon) {
      const coupon = await stripe.coupons.create({
        amount_off: req.body.coupon.Amount,
        currency: "EGP",
        duration: "once",
      });

      console.log(coupon);
      req.body.couponId = coupon.id;
    }

    const session = await payment({
      stripe,
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: { orderId: order._id.toString() },
      mode: "payment",
      success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
      cancel_url: `${req.protocol}://${req.headers.host}/order/cancel/${order._id}`,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "EGP",
            unit_amount: product.price * 100,
            product_data: {
              name: product.title,
            },
          },
          quantity: product.quantity,
        };
      }),
      discounts: req.body?.coupon ? [{ coupon: req.body.couponId }] : [],
    });

    return res.status(200).json({ msg: "done", url: session.url });
  }
};

/*
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
};

*/

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

export const webhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send({ error: "Missing Stripe signature" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Corrected to req.body, as req contains the raw body
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send({ error: `Webhook Error: ${err.message}` });
  }

  const { orderId } = event.data.object.metadata;

  try {
    if (event.type === "checkout.session.completed") {
      await Order.findOneAndUpdate({ _id: orderId }, { orderStatus: "placed" });
      return res.status(200).json({ status: "done" });
    } else {
      await Order.findOneAndUpdate(
        { _id: orderId },
        { orderStatus: "Rejected" }
      );
      return res.status(400).json({ status: "fail" });
    }
  } catch (dbError) {
    console.error(`Database Error: ${dbError.message}`);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
