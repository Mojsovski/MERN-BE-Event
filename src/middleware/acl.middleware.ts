import { Response, NextFunction } from "express";
import { IReqUser } from "../utils/interface";

export default (roles: string[]) => {
  return (req: IReqUser, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      res.status(403).json({
        data: null,
        message: "Forbidden",
      });
      return;
    }
    next();
  };
};
