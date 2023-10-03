import express from "express";
const { authCookieJwt } = require("../middleware/authJwt");
const project = express.Router();
const projectController = require("../controller/projectController");
import {
  createProjectValidate,
  updateProjectValidate,
} from "../middleware/projectValidate";

// Create project against userId.....
project.post(
  "/:id",
  createProjectValidate(),
  authCookieJwt,
  projectController.createProject
);
// get projects against userId.....
project.get("/all/:id", authCookieJwt, projectController.getAllProject);
// get single project against userId.....
project.get("/:uuid", authCookieJwt, projectController.getSinglProject);
// Delete project.
project.delete("/:uuid", authCookieJwt, projectController.deleteProject);
// Update project.
project.put(
  "/:uuid",
  updateProjectValidate(),
  authCookieJwt,
  projectController.updateProject
);

export { project };
