import { Request, Response } from "express";
import UserModel, {
  userDTO,
  userLoginDTO,
  userUpdatePasswordDTO,
} from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

export default {
  async register(req: Request, res: Response) {
    const { userName, fullName, email, password, confirmPassword } = req.body;

    try {
      await userDTO.validate({
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
    try {
      const { identifier, password } = req.body;

      await userLoginDTO.validate({
        identifier,
        password,
      });

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
        return response.unauthorized(res, "password salah!");
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

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      response.success(res, result, "berhasil mengambil user profile");
    } catch (error) {
      response.error(res, error, "gagal mengambil user profile");
    }
  },

  async updateProfile(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { fullName, profilePicture } = req.body;

      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          fullName,
          profilePicture,
        },
        {
          new: true,
        }
      );

      if (!result) {
        response.notFound(res, "user tidak ditemukan");
      }

      response.success(res, result, "berhasi; mengubah user profile");
    } catch (error) {
      response.error(res, error, "gagal mengubah user profile");
    }
  },

  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { oldPassword, password, confirmPassword } = req.body;

      await userUpdatePasswordDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      });

      const user = await UserModel.findById(userId);

      if (!user || user.password !== encrypt(oldPassword)) {
        return response.notFound(res, "user tidak ditemukan");
      }

      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          password: encrypt(password),
        },
        {
          new: true,
        }
      );

      response.success(res, result, "password user telah diubah");
    } catch (error) {
      response.error(res, error, "gagal mengubah password");
    }
  },
};
