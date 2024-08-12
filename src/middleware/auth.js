import jwt from "jsonwebtoken";
import AppError from "../utilis/errorClass.js";
import User from "../../Data Base/models/user.model.js";

const auth = (role = []) => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) throw new AppError("token not found");

    const decoded = jwt.verify(token, process.env.logeInSegnature);
    const user = await User.findOne({
      email: decoded.email,
      isConfirmed: true,
    });


    if (!user) throw new AppError("user not found");
    if (!role.includes(user.role))
      throw new AppError("you don't have permission");

    if (parseInt(user?.passChengedAt?.getTime() / 1000) > decoded.iat) {
      return res
        .status(400)
        .json({ msg: "token is expired please log in again" });
    }
    req.user = user;
    next();
  };
};

export default auth;
