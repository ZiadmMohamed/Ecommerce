import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.emailSender,
    pass: process.env.password,
  },
});

export const sendEmail = async (
  to,
  subject = "",
  html = "",
  attachments = []
) => {
  const info = await transporter.sendMail({
    from: `ziad yassin ${process.env.emailSender}`,
    to: to,
    subject: subject,
    html: html,
    attachments,
  });

  console.log("Message sent: %s", info.messageId);
};
