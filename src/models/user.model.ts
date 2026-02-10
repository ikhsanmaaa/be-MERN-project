import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { ROLES } from "../utils/constant";
import * as yup from "yup";

const validatePassword = yup
  .string()
  .required()
  .min(6)
  .matches(/[A-Z]/, "must contain uppercase letter")
  .matches(/[0-9]/, "must contain number");

const validateConfirmPassword = yup
  .string()
  .required()
  .oneOf([yup.ref("password")], "password must match");

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: string;
}

export const USER_MODEL_NAME = "User";

export const userLoginDTO = yup.object({
  identifier: yup.string().required(),
  password: validatePassword,
});

export const userUpdateDTO = yup.object({
  oldPassword: validatePassword,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
});

export const userDTO = yup.object({
  fullName: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
});

export type TypeUser = yup.InferType<typeof userDTO>;

export interface User extends Omit<TypeUser, "confirmPassword"> {
  isActive: boolean;
  activationCode: string;
  role: string;
  profilePicture: string;
  createdAt?: string;
}

const schema = mongoose.Schema;
const userSchema = new schema<User>(
  {
    fullName: {
      type: schema.Types.String,
      required: true,
    },
    username: {
      type: schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: schema.Types.String,
      required: true,
    },
    role: {
      type: schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
    },
    profilePicture: {
      type: schema.Types.String,
      default: "user.jpg",
    },
    isActive: {
      type: schema.Types.Boolean,
      default: false,
    },
    activationCode: {
      type: schema.Types.String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  user.activationCode = encrypt(user.id);
  next();
});

userSchema.post("save", async function (doc, next) {
  try {
    const user = doc;
    console.log(`email activation was sent to: ${user.email}`);
    const contentMail = await renderMailHtml("registration-succes.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });
    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Aktivasi Akun Anda",
      html: contentMail,
    });
  } catch (error) {
    console.log(`error: ${error}`);
  } finally {
    next();
  }
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
const userModel = mongoose.model(USER_MODEL_NAME, userSchema);

export default userModel;
