export  const validation = (schema) => {
  return (req, res, next) => {
    let errors = [];
    const dataMethod = ["body", "query", "headers", "file", "files"];
    dataMethod.forEach((method) => {
      if (schema[method]) {
        const data = schema[method].validate(req[method], {
          abortEarly: false,
        });
        if (data.error) {
          errors.push(data.error.details);
        }
      }
    });
    if (errors.length) {
      return res.status(400).json({ msg: "validation error", errors: errors });
    }
    next();
  };
};
