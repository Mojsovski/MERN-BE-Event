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
import ticketController from "../controller/ticket.controller";

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
  /*
  #swagger.tags = ['Media']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    content:  {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary"
            }
          }
        }
      }  
    }
  }  
  */
);

router.post(
  "/media/upload-multiple",
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.multiple("files"),
  ],
  mediaController.multiple
  /*
  #swagger.tags = ['Media']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    content:  {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }  
    }
  }  
  */
);

router.delete(
  "/media/remove",
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  mediaController.remove
  /*
  #swagger.tags = ['Media']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/RemoveMediaRequest"
    }
  }
  */
);

// category route
router.post(
  "/category",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.create

  /*
  #swagger.tags = ['Category']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateCategoryRequest"
    }
  }
  */
);

router.get(
  "/category",
  categoryController.findAll
  /*
  #swagger.tags = ['Category']
  */
);

router.get(
  "/category/:id",
  categoryController.findOne
  /*
  #swagger.tags = ['Category']
  */
);

router.put(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.update
  /*
  #swagger.tags = ['Category']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateCategoryRequest"
    }
  }  
  */
);

router.delete(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.remove
  /*
  #swagger.tags = ['Category']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);

// location
router.get(
  "/region",
  regionController.getAllProvinces
  /*
  #swagger.tags = ['Regions']
  */
);

router.get(
  "/region/:id/province",
  regionController.getProvince
  /*
  #swagger.tags = ['Regions']
  */
);

router.get(
  "/region/:id/regency",
  regionController.getRegency
  /*
  #swagger.tags = ['Regions']
  */
);

router.get(
  "/region/:id/district",
  regionController.getDistrict
  /*
  #swagger.tags = ['Regions']
  */
);

router.get(
  "/region/:id/village",
  regionController.getVillage
  /*
  #swagger.tags = ['Regions']
  */
);

router.get(
  "/region-search",
  regionController.findByCity
  /*
  #swagger.tags = ['Regions']
  */
);

// event endpoint
router.post(
  "/event",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.create
  /*
  #swagger.tags = ['Events']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateEventRequest"
    }
  }  
  */
);

router.get(
  "/event",
  eventController.findAll
  /*
  #swagger.tags = ['Events']
  */
);

router.get(
  "/event/:id",
  eventController.findOne
  /*
  #swagger.tags = ['Events']
  */
);

router.put(
  "/event/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update
  /*
  #swagger.tags = ['Events']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateEventRequest"
    }
  }  
  */
);

router.delete(
  "/event/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
  /*
  #swagger.tags = ['Events']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);

router.get(
  "/event/:slug/slug",
  eventController.findOnebySlug
  /*
  #swagger.tags = ['Events']
  */
);

// ticket endpoint
router.post(
  "/tickets",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.create
);

router.get("/tickets", ticketController.findAll);

router.get("/tickets/:id", ticketController.findOne);

router.put(
  "/tickets/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.update
);

router.delete(
  "/tickets/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.remove
);

router.get("/tickets/:eventId/events", ticketController.findAllByEvent);

export default router;
