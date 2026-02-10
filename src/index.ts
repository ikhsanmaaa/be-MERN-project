import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/db";
import docs from "./docs/route";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";

async function init() {
  try {
    const result = await db();
    const app = express();
    const PORT = 3000;

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/api", router);

    docs(app);

    app.use(errorMiddleware.serverRoute());
    app.use(errorMiddleware.serverError());

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "server is running!",
        data: null,
      });
    });

    app.listen(PORT, () =>
      console.log(`server is running on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
}

init();
