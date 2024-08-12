import Joi from "joi";
import mongoose from "mongoose";

const idValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID format");
  }
  return value;
};

export const cartValidation = {
  body: Joi.object({
    productId: Joi.string().custom(idValidation).required(),
    quantity: Joi.number().required(),
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
export const removeProductValidation = {
  params: Joi.object({
    productId: Joi.string().custom(idValidation).required(),
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
