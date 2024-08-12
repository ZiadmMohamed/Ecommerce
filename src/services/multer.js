import multer from "multer";
import AppError from "../utilis/errorClass.js";

export const validExtensions = {
  image: ["image/png", "image/jpeg"],
};

const onlineMulter = (customValidation = validExtensions.image) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (!customValidation.includes(file.mimetype))
      return cb(new AppError("File type not supported", 400), false);

    cb(null, true);
  };
  
  return multer({ storage: storage, fileFilter: fileFilter });
};

export default onlineMulter;
