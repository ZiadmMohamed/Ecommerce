import Joi from "joi";
import mongoose from "mongoose";

const idValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID format");
  }
  return value;
};

export const subCategoryValidation = {
  body: Joi.object({
    name: Joi.string(),
  }).options({ presence: "required" }),

  params: Joi.object({
    categoryId: Joi.string().custom(idValidation),
  }),

  file: Joi.object({
    size: Joi.number().positive(),
    path: Joi.string(),
    filename: Joi.string(),
    destination: Joi.string(),
    mimetype: Joi.string(),
    encoding: Joi.string(),
    originalname: Joi.string(),
    fieldname: Joi.string(),
  }).options({ presence: "required" }),

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
