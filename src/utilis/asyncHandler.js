import AppError from "./errorClass.js";

export  const handle = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      next(err);
    });
  };
};
