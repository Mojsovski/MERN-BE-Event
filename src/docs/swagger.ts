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
        identifier: "ambadianto30",
        password: "Wongliyoretiopo12",
      },
      RegisterRequest: {
        fullName: "Mulyono",
        userName: "mulyono10",
        email: "mulyono10@yopmail.com",
        password: "plongaplongo11",
        confirmPassword: "plongaplongo11",
      },
      ActivationRequest: {
        code: "abcdef",
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "Acara 3",
        banner:
          "https://res.cloudinary.com/mojsovski/image/upload/v1739766299/n9bbhau6mynrywdqho4v.jpg",
        category: "67b3ee3bebdd3480ec24a857",
        description: "Acara 3 event test",
        startDate: "2025-02-02 12:00:54",
        endDate: "2025-02-02 14:40:54",
        location: {
          region: "3404070003",
          coordinates: [6.6, 10.1],
          address: "",
        },
        isOnline: false,
        isFeatured: true,
        isPublish: false,
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointFile = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointFile, doc);
