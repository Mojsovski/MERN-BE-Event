import { Request } from "express";
import { Types } from "mongoose";
import { User } from "../models/user.model";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export interface IUserToken
  extends Omit<
    User,
    | "password"
    | "activationCode"
    | "isActive"
    | "email"
    | "fullName"
    | "profilePicture"
    | "userName"
  > {
  id?: Types.ObjectId;
}

export interface IPaginatinationQuery {
  page: number;
  limit: number;
  search?: string;
}
