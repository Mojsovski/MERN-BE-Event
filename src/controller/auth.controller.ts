import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";

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
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password tidak sama"),
});

export default {
  async register(req: Request, res: Response) {
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

      res.status(200).json({
        message: "berhasil login",
        data: userbyIdentifier,
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
