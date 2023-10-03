import express from "express";
const upload = require("multer")();
const user = express.Router();
const { authCookieJwt } = require("../middleware/authJwt");
const userController = require("../controller/userController");
import {
  loginValidate,
  userValidate,
  userUpdateValidate,
} from "../middleware/userValidation";

// Get all users......
user.get("/", authCookieJwt, userController.getAllUsers);
// Create user
user.post("/signup", upload.any(), userValidate(), userController.createUser);
// Get the user agains uuid
user.get("/:uuid", authCookieJwt, userController.getUserInfo);
// Delete User against uuid
user.delete("/:uuid", authCookieJwt, userController.deleteUser);
// Update User against uuid
user.put(
  "/:uuid",
  upload.any(),
  userUpdateValidate(),
  authCookieJwt,
  userController.updateUser
);
// Login User
user.post("/login", loginValidate(), userController.userLogin);

export { user };
