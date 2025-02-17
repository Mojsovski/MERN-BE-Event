import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./env";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

//convert string to base64
const toDataURL = (file: Express.Multer.File) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURL = `data:${file.mimetype};base64,${b64}`;
  return dataURL;
};

//get id file url
const getPublicIdFromFileUrl = (fileUrl: string) => {
  const fileNameUsingSubsting = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
  const publicId = fileNameUsingSubsting.substring(
    0,
    fileNameUsingSubsting.lastIndexOf(".")
  );
  return publicId;
};

//handle upload
export default {
  async uploadSingle(file: Express.Multer.File) {
    const fileDataURL = toDataURL(file);
    const result = await cloudinary.uploader.upload(fileDataURL, {
      resource_type: "auto",
    });
    return result;
  },

  async uploadMultiple(files: Express.Multer.File[]) {
    const uploadBatch = files.map((item) => {
      const result = this.uploadSingle(item);
      return result;
    });
    const result = await Promise.all(uploadBatch);
    return result;
  },
  async remove(fileUrl: string) {
    const publicId = getPublicIdFromFileUrl(fileUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  },
};
