import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

export const sendEmail = async (to, subject, text, html) => {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: `"Lein Dein" <${process.env.GOOGLE_USER}>`,
    to,
    subject,
    text,
    html,
  });
};
