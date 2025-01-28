import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  userName: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(6, "Password harus minimal 6 karakter")
    .test(
      "minimal-terdapat-satu-huruf-besar",
      "Password minimal terdapat 1 huruf besar",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test(
      "minimal-terdapat-satu-angka",
      "Password minimal terdapat angka",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
      }
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password tidak sama"),
});

export default {
  async register(req: Request, res: Response) {
    /**
 #swagger.tag = ['Auth']
 */

    const { userName, fullName, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        userName,
        fullName,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        userName,
        fullName,
        email,
        password,
      });

      res.status(200).json({
        message: "Registrasi Berhasil",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.tag = ['Auth']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/loginRequest"}}
     */

    const { identifier, password } = req.body as unknown as TLogin;
    try {
      //ambil data user berdasarkan "identifier" => email dan username
      const userbyIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            userName: identifier,
          },
        ],
        isActive: true,
      });

      if (!userbyIdentifier) {
        res.status(403).json({
          message: "user not found",
          data: null,
        });
        return;
      }

      //validasi password
      const validatePassword: boolean =
        encrypt(password) === userbyIdentifier.password;

      if (!validatePassword) {
        res.status(403).json({
          message: "password salah",
          data: null,
        });
        return;
      }

      const token = generateToken({
        id: userbyIdentifier._id,
        role: userbyIdentifier.role,
      });

      res.status(200).json({
        message: "berhasil login",
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
    #swagger.tag = ['Auth']
    #swagger.security = [{
    "bearerAuth": []
    }]
 */

    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "berhasil mengambil user profile",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async activation(req: Request, res: Response) {
    /**
     #swagger.tag = ['Auth']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/ActivationRequest"}}
     */
    try {
      const { code } = req.body as { code: string };
      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "user telah teraktivasi",
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
