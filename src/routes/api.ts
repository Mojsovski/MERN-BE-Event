import express from "express";
import authController from "../controller/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import aclMiddleware from "../middleware/acl.middleware";
import { ROLES } from "../utils/constant";
import mediaMiddleware from "../middleware/media.middleware";
import mediaController from "../controller/media.controller";
import categoryController from "../controller/category.controller";
import regionController from "../controller/region.controller";
import eventController from "../controller/event.controller";

const router = express.Router();

// auth route
router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

router.get("/auth/me", authMiddleware, authController.me);

router.post("/auth/activation", authController.activation);

// media route
router.post(
  "/media/upload-single",
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.single("file"),
  ],
  mediaController.single
);

router.post(
  "/media/upload-multiple",
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.multiple("files"),
  ],
  mediaController.multiple
);

router.delete(
  "/media/remove",
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  mediaController.remove
);

// category route
router.post(
  "/category",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.create
);

router.get("/category", categoryController.findAll);

router.get("/category/:id", categoryController.findOne);

router.put(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.update
);

router.delete(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.remove
);

// location
router.get("/region", regionController.getAllProvinces);

router.get("/region/:id/province", regionController.getProvince);

router.get("/region/:id/regency", regionController.getRegency);

router.get("/region/:id/district", regionController.getDistrict);

router.get("/region/:id/village", regionController.getVillage);

router.get("/region-search", regionController.findByCity);

//event
router.post(
  "/event",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.create
);

router.get("/event", eventController.findAll);

router.get("/event/:id", eventController.findOne);

router.put(
  "/event/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update
);

router.delete(
  "/event/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
);

router.get("/event/:slug/slug", eventController.findOnebySlug);

export default router;
