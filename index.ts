import express from "express";
const app = express();
// const cookieParser = require("cookie-parser");
import cors from "cors";
const port = 3000;
import db from "./dbData/models";
import { user } from "./src/routes/userRoute";
import { project } from "./src/routes/projectRoute";

app.use(express.json());
app.use(cors());
// app.use(cookieParser());

app.use("/user", user);
app.use("/project", project);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server listen on the port ${port}`);
  });
});

// unhandled case handling
