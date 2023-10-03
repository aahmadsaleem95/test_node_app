import {  Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import {TRequest as Request} from "../index"; // gracefull wayout.

exports.authCookieJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("authToken");
    if (token) {
      const user = jwt.verify(token, process.env.MY_SECRET);
      if (user) {
        req.userData = user;
        next();
      } else {
        return res.status(200).json({ msg: "No content available."  });
      }
    }
  } catch (err) {
    // res.clearCookie("token");
    return res.status(401).json({ error: "Authenticate using a valid token." });
  }
};

// Eslint
// prienter

// error:
// Error code:
// body:
// {
//     message: '',
//     errors: []
// }
