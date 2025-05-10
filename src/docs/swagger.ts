import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API Event",
    description: "Dokumentasi API Event",
  },
  servers: [
    {
      url: " http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: " https://mern-be-event.vercel.app/api",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      loginRequest: {
        identifier: "email or username",
        password: "password",
      },
      RegisterRequest: {
        fullName: "fullname",
        userName: "username",
        email: "email",
        password: "password",
        confirmPassword: "confirm password",
      },
      ActivationRequest: {
        code: "from email",
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateCategoryRequest: {
        name: "category name",
        description: "category description",
        icon: "category icon ",
      },
      CreateEventRequest: {
        name: "event name",
        banner: "image url ",
        category: "category id",
        description: "event description",
        startDate: "yyyy-mm-dd hh-mm-ss",
        endDate: "yyyy-mm-dd hh-mm-ss",
        location: {
          region: "3404070003  id from village",
          coordinates: [0, 0],
          address: "address",
        },
        isOnline: false,
        isFeatured: true,
        isPublish: false,
      },
      CreateBannerRequest: {
        title: "banner title",
        image: "banner image url",
        isShow: true,
      },
      CreateTicketRequest: {
        price: "price",
        name: "ticket name",
        events: "objectid",
        description: "ticket description",
        quantity: "ticket quantity",
      },
      CreateOrderRequest: {
        events: "event object id",
        ticket: "ticket object id",
        quantity: 1,
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointFile = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointFile, doc);
