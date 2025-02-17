import { Response } from "express";
import { IReqUser } from "../utils/interface";
import uploader from "../utils/uploader";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      res.status(400).json({
        data: null,
        message: "File is not exist",
      });
      return;
    }

    try {
      const result = await uploader.uploadSingle(
        req.file as Express.Multer.File
      );
      res.status(200).json({
        data: result,
        message: " success upload a file",
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: " failed upload a file",
      });
    }
  },

  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      res.status(400).json({
        data: null,
        message: "Files is not exist",
      });
      return;
    }

    try {
      const result = await uploader.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      res.status(200).json({
        data: result,
        message: " success upload files",
      });
    } catch {
      res.status(500).json({
        data: null,
        message: " failed upload files",
      });
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await uploader.remove(fileUrl);
      res.status(200).json({
        data: result,
        message: " success remove files",
      });
    } catch {
      res.status(500).json({
        data: null,
        message: " failed remove files",
      });
    }
  },
};
