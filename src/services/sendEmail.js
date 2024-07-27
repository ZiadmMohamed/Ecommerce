import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ziady5060@gmail.com",
    pass: "loiiyzvktviifcjm",
  },
});

export const sendEmail = async (to, subject = "", html = "") => {
  const info = await transporter.sendMail({
    from: '"ziad yassin" <ziady5060@gmail.com>',
    to: to,
    subject: subject,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
};
