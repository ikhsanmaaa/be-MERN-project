import { Request, Response } from "express";
import * as yup from "yup";
import userModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

export default {
  // =========================
  // REGISTER
  // =========================
  async register(req: Request, res: Response) {
    /**
     #swagger.tags=['auth']
     */
    try {
      const payload = req.body as TRegister;

      await registerValidateSchema.validate(payload);

      const user = await userModel.create({
        fullName: payload.fullName,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        // isActive default = false (di schema)
      });

      response.success(res, user, "success registration");
    } catch (error) {
      response.error(res, error, "failed registration");
    }
  },

  // =========================
  // LOGIN
  // =========================
  async login(req: Request, res: Response) {
    /**
     #swagger.tags=['auth']
     #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/LoginRequest"}
     }
     */
    try {
      const { identifier, password } = req.body as TLogin;

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

  // =========================
  // GET ME
  // =========================
  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags=['auth']
     #swagger.security = [{ "bearerAuth": [] }]
     */
    try {
      const user = await userModel.findById(req.user?.id).select("-password");
      response.success(res, user, "success get profile");
    } catch (error) {
      response.error(res, error, "failed get profile");
    }
  },

  // =========================
  // ACTIVATION
  // =========================
  async activation(req: Request, res: Response) {
    /**
     #swagger.tags=['auth']
     */
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
