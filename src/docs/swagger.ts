import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "dokumentasi API MERN-Stack",
    description: "dokumentasi API MERN-Stack",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://mern-project-gamma-jet.vercel.app/api",
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
      LoginRequest: {
        identifier: "temon",
        password: "Temon123",
      },
      activation: {
        code: "abcde",
      },
      UpdateProfile: {
        fullName: "",
        profilePicture: "",
      },
      UpdatePassword: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category ObjectID",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinates: [0, 0],
          address: "",
        },
        isOnline: false,
        isFeatured: false,
        isPublish: false,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateBannerRequest: {
        title: "Slipknot Concert",
        image:
          "https://res.cloudinary.com/dsabcs3bo/image/upload/v1769606677/cuvrlae4ndmgx2ztbifl.jpg",
        isShow: true,
      },
      CreateTicketRequest: {
        price: 500,
        name: "Ticket common",
        events: "69787450244a8dc994fef5d3",
        description: "cheap one",
        quantity: 10000,
      },
      CreateOrderRequest: {
        events: "event object id",
        ticket: "ticket object id",
        quantity: 1,
      },
    },
  },
};
const OutputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(OutputFile, endpointsFiles, doc);
