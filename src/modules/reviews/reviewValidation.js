import Joi from "joi";
import mongoose from "mongoose";

const idValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID format");
  }
  return value;
};

export const addReviewValidation = {
  body: Joi.object({
    comment: Joi.string().required(),
    rate: Joi.number().min(1).max(5).required(),
  }),
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
export const delReviewValidation = {
  body: Joi.object({
    reviewId: Joi.string().custom(idValidation).required(),
  }),
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
