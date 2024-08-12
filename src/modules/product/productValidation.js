import { query } from "express";
import Joi from "joi";
import mongoose from "mongoose";

const idValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID format");
  }
  return value;
};

export const productValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    categoryId: Joi.string().custom(idValidation).required(),
    subCategoryId: Joi.string().custom(idValidation).required(),
    brandId: Joi.string().custom(idValidation).required(),
    price: Joi.number().required(),
    discount: Joi.number().default(1),
    stock: Joi.number().default(0),
  }),

  files: Joi.object({
    image: Joi.array()
      .items(
        Joi.object({
          size: Joi.number().positive().required(),
          path: Joi.string().required(),
          filename: Joi.string().required(),
          destination: Joi.string().required(),
          mimetype: Joi.string().required(),
          encoding: Joi.string().required(),
          originalname: Joi.string().required(),
          fieldname: Joi.string().required(),
        })
      )
      .required(),
    images: Joi.array()
      .items(
        Joi.object({
          size: Joi.number().positive().required(),
          path: Joi.string().required(),
          filename: Joi.string().required(),
          destination: Joi.string().required(),
          mimetype: Joi.string().required(),
          encoding: Joi.string().required(),
          originalname: Joi.string().required(),
          fieldname: Joi.string().required(),
        })
      )
      .required(),
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

export const updateProductValidation = {
  body: Joi.object({
    title: Joi.string(),
    desc: Joi.string(),
    categoryId: Joi.string().custom(idValidation).required(),
    subCategoryId: Joi.string().custom(idValidation).required(),
    brandId: Joi.string().custom(idValidation).required(),
    price: Joi.number(),
    discount: Joi.number(),
    stock: Joi.number(),
  }),

  params: Joi.object({
    id: Joi.string().custom(idValidation).required(),
  }),

  files: Joi.object({
    image: Joi.array().items(
      Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required(),
      })
    ),

    images: Joi.array().items(
      Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required(),
      })
    ),
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

export const paginationValidation = {
  query: Joi.object({
    page: Joi.number().required(),
  }),
};
