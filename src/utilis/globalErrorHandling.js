const globalErrorHandling = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ msg: `Catch error: ${err.message} `, stack: err.stack });
  next();
};

export default globalErrorHandling;
