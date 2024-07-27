import Joi from "joi";

export const signUpValidation = {
  body: Joi.object({
    username: Joi.string().min(3).max(30),
    password: Joi.string(),
    // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    cpassword: Joi.string().valid(Joi.ref("password")),
    age: Joi.number().integer(),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phoneNumbers: Joi.array().items(Joi.string()),
    addresses: Joi.array().items(Joi.string()),
  }).options({ presence: "required" }),
};

export const signInValidation = {
  body: Joi.object({
    password: Joi.string(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  }).options({ presence: "required" }),
};
