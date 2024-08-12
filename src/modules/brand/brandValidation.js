import Joi from "joi";

export const brandValidation = {
  body: Joi.object({
    name: Joi.string(),
    subCategoryId: Joi.string(),
  }).options({ presence: "required" }),

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
