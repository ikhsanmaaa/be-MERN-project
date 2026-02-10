import { Request, Response } from "express";
import * as yup from "yup";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import userModel, {
  userDTO,
  userLoginDTO,
  userUpdateDTO,
} from "../models/user.model";

export default {
  async updateProfile(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { fullName, profilePicture } = req.body;

      const result = await userModel.findByIdAndUpdate(
        userId,
        {
          fullName,
          profilePicture,
        },
        { new: true },
      );

      if (!result) return response.notFound(res, "user not found");

      response.success(res, result, "success to update profile");
    } catch (error) {
      response.error(res, error, "failed to update profile");
    }
  },
  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { oldPassword, password, confirmPassword } = req.body;

      await userUpdateDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      });

      const user = await userModel.findById(userId);

      if (!user || user.password !== encrypt(oldPassword))
        return response.notFound(res, "user not found");

      const result = await userModel.findByIdAndUpdate(
        userId,
        {
          password: encrypt(password),
        },
        { new: true },
      );

      response.success(res, result, "success to update password");
    } catch (error) {
      response.error(res, error, "failed to update password");
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { fullName, username, email, password, confirmPassword } = req.body;

      await userDTO.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await userModel.create({
        fullName,
        email,
        username,
        password,
      });

      response.success(res, result, "success registration");
    } catch (error) {
      response.error(res, error, "failed registration");
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;

      await userLoginDTO.validate({
        identifier,
        password,
      });

      const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return response.unauthorized(res, "user not found");
      }

      if (!user.isActive) {
        return response.unauthorized(res, "user not activated yet");
      }

      const isPasswordValid = encrypt(password) === user.password;

      if (!isPasswordValid) {
        return response.unauthorized(res, "invalid credentials");
      }

      const token = generateToken({
        id: user._id,
        role: user.role,
      });

      response.success(res, token, "login success");
    } catch (error) {
      response.error(res, error, "login failed");
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = await userModel.findById(req.user?.id).select("-password");
      response.success(res, user, "success get profile");
    } catch (error) {
      response.error(res, error, "failed get profile");
    }
  },

  async activation(req: Request, res: Response) {
    try {
      const { code } = req.body as { code: string };

      const user = await userModel.findOneAndUpdate(
        { activationCode: code },
        { isActive: true },
        { new: true },
      );

      if (!user) {
        return response.unauthorized(res, "invalid activation code");
      }

      response.success(res, user, "user successfully activated");
    } catch (error) {
      response.error(res, error, "failed to activate account");
    }
  },
};
const registerValidateSchema = yup.object({
  fullName: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(6)
    .matches(/[A-Z]/, "must contain uppercase letter")
    .matches(/[0-9]/, "must contain number"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "password must match"),
});
