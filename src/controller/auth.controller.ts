import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

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

      response.success(res, result, "Registrasi Berhasil");
    } catch (error) {
      response.error(res, error, "Registrasi Gagal");
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
        isActive: true,
      });

      if (!userbyIdentifier) {
        return response.unauthorized(res, "user not found!");
      }

      //validasi password
      const validatePassword: boolean =
        encrypt(password) === userbyIdentifier.password;

      if (!validatePassword) {
        return response.unauthorized(res, "user not found!");
      }

      const token = generateToken({
        id: userbyIdentifier._id,
        role: userbyIdentifier.role,
      });

      response.success(res, token, "login berhasil");
    } catch (error) {
      response.error(res, error, "login gagal");
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      response.success(res, result, "berhasil mengambil user profile");
    } catch (error) {
      response.error(res, error, "gagal mengambil user profile");
    }
  },

  async activation(req: Request, res: Response) {
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

      response.success(res, user, "user telah teraktivasi");
    } catch (error) {
      response.error(res, error, "gagal aktivasi user");
    }
  },
};
