import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
};
