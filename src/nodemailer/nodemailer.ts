// src/nodemailer/nodemailer.ts
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

const email: string | undefined = process.env.EMAIL;
const emailZ: string | undefined = process.env.EMAILZ;
const pass: string | undefined = process.env.EMAIL_PASSWORD;

// Validate environment variables
if (!email || !emailZ || !pass) {
  throw new Error("Missing required email environment variables");
}

export const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});

export const mailOptions: SendMailOptions = {
  from: email,
  to: emailZ,
};
