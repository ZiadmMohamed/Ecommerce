import Joi from "joi";
import mongoose from "mongoose";

const idValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID format");
  }
  return value;
};

export const orderValidation = {
  body: Joi.object({
    productId: Joi.string().custom(idValidation),
    couponCode: String,
    address: Joi.string().required(),
    phoneNumbers: Joi.string().required(),
    paymentMethod: Joi.string().valid("card", "cash").required(),

    quantity: Joi.number().when("productId", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

    headers: Joi.object({
      token: Joi.string().required(),

      "user-agent": Joi.any(),
      "cache-control": Joi.any(),
      accept: Joi.any(),
      "content-type": Joi.any(),
      "postman-token": Joi.any(),
      host: Joi.any(),
      "accept-encoding": Joi.any(),
      connection: Joi.any(),
      "content-length": Joi.any(),
    }),
  }),
};

export const cancleOrderValidation = {
  body: Joi.object({
    reason: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),

    "user-agent": Joi.any(),
    "cache-control": Joi.any(),
    accept: Joi.any(),
    "content-type": Joi.any(),
    "postman-token": Joi.any(),
    host: Joi.any(),
    "accept-encoding": Joi.any(),
    connection: Joi.any(),
    "content-length": Joi.any(),
  }),
};
