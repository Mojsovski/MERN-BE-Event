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
import bannerController from "../controller/banner.controller";

const router = express.Router();

// auth route
router.post(
  "/auth/register",
  authController.register

  /*
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/RegisterRequest"}
     }
    */
);

router.post(
  "/auth/login",
  authController.login

  /*
      #swagger.tags = ['Auth']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/loginRequest"}}
     */
);

router.get(
  "/auth/me",
  authMiddleware,
  authController.me

  /*
     #swagger.tags = ['Auth']
    #swagger.security = [{
    "bearerAuth": []
    }]
 */
);

router.post(
  "/auth/activation",
  authController.activation

  /*
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/ActivationRequest"}}
     */
);

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

  /*
  #swagger.tags = ['Tickets']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateTicketRequest"
    }
  }
  */
);

router.get(
  "/tickets",
  ticketController.findAll

  /*
  #swagger.tags = ['Tickets']
  */
);

router.get(
  "/tickets/:id",
  ticketController.findOne

  /*
  #swagger.tags = ['Tickets']
  */
);

router.put(
  "/tickets/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.update

  /*
  #swagger.tags = ['Tickets']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateTicketRequest"
    }
  }  
  */
);

router.delete(
  "/tickets/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.remove

  /*
  #swagger.tags = ['Tickets']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);

router.get(
  "/tickets/:eventId/events",
  ticketController.findAllByEvent

  /*
 #swagger.tags = ['Tickets']
*/
);

// banner endpoint
router.post(
  "/banners",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.create

  /*
  #swagger.tags = ['Banners']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateBannerRequest"
    }
  }
  */
);

router.get(
  "/banners",
  bannerController.findAll

  /*
 #swagger.tags = ['Banners']
*/
);

router.get(
  "/banners/:id",
  bannerController.findOne

  /*
 #swagger.tags = ['Banners']
*/
);

router.put(
  "/banners/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.update

  /*
  #swagger.tags = ['Banners']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateBannerRequest"
    }
  }  
  */
);

router.delete(
  "/banners/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.remove

  /*
  #swagger.tags = ['Banners']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);

export default router;
