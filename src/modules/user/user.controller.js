import jwt from "jsonwebtoken";
import User from "../../../Data Base/models/user.model.js";
import { sendEmail } from "../../services/sendEmail.js";
import AppError from "../../utilis/errorClass.js";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

export const signUp = async (req, res, next) => {
  const { username, email, password, age, phoneNumbers, addresses } = req.body;
  if (!password) {
    return next(new AppError("Passwords  are missing", 400));
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  user && new AppError("user is already exist");

  const token = jwt.sign({ email }, process.env.emailSegnature, {
    expiresIn: 6,
  });
  const Link = `${req.protocol}://${req.headers.host}/user/verifyAcount/${token}`;

  const refToken = jwt.sign({ email }, process.env.refemailSegnature);
  const refLink = `${req.protocol}://${req.headers.host}/user/resendLink/${refToken}`;
  await sendEmail(
    email,
    "verify your account",
    `<a href="${Link}">Click Me</a>
    <a href="${refLink}">Resend Linke</a>
    `
  );

  const hash = bcrypt.hashSync(password, 8);
  const newUser = await User.create({
    username,
    email,
    password: hash,
    age,
    phoneNumbers,
    addresses,
  });
  newUser
    ? res.status(200).json({ msg: "done", newUser })
    : new AppError("user not created");
};
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
    isConfirmed: true,
  });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new AppError("email or password isn't correct");
  }

  await User.updateOne({ email }, { isLoggedIn: true });
  const token = jwt.sign(
    { email, role: user.role },
    process.env.logeInSegnature
  );
  return res.status(200).json({ msg: "done", token: token });
};

export const verifyAcount = async (req, res) => {
  const token = req.params.token;
  const { email } = jwt.verify(token, process.env.emailSegnature);
  if (!email) new AppError("invalid token", 400);
  const updated = await User.updateOne(
    { email, isConfirmed: false },
    { isConfirmed: true }
  );
  return res.status(200).json({ msg: "done", updated });
};

export const refToken = async (req, res) => {
  const refToken = req.params.refToken;
  const { email } = jwt.verify(refToken, process.env.refemailSegnature);
  if (!email) new AppError("invalid token", 400);

  const user = User.findOne({ email, isConfirmed: false });
  if (!user) new AppError("user already confirmed", 400);

  const token = jwt.sign({ email }, "email", { expiresIn: 60 });
  const Link = `${req.protocol}://${req.headers.host}/user/verifyAcount/${token}`;
  await sendEmail(
    email,
    "verify your account",
    `<a href="${Link}">Click Me</a>`
  );
  return res.status(200).json({ msg: "done" });
};

export const forgetPass = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("Enter your Email", 400);
  }

  const user = await User.findOne({
    email,
    isConfirmed: true,
  });
  user || new AppError("user isn't exist");

  const token = jwt.sign(
    { email: email.toLowerCase() },
    process.env.emailSegnature
  );
  const Link = `${req.protocol}://${req.headers.host}/user/resetPassword/${token}`;
  const code = customAlphabet("123456789", 4);
  const otp = code();

  await User.updateOne({ email }, { otp: otp });

  await sendEmail(email, `OTP :${otp}`);
  return res.status(200).json({ msg: "OTP Sent", Link });
};

export const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { OTP, newPassword } = req.body;

  if (!newPassword) throw new AppError("Pleasde enter the new pasword");
  if (!OTP) throw new AppError("Pleasde enter the  OTP");

  const { email } = jwt.verify(token, process.env.emailSegnature);
  if (!email) throw new AppError("invalid token", 400);

  const user = await User.findOne({ email });

  if (OTP != user.otp) throw new AppError("the OTP isn't correct");
  if (user.otp == "") throw new AppError("invalid code");

  const hash = bcrypt.hashSync(newPassword, 8);

  const updated = await User.updateOne(
    { email },
    { password: hash, otp: "", passChengedAt: Date.now(), isLoggedIn: false }
  );
  return res.status(200).json({ msg: "done", updated });
};
