import { body } from "express-validator";

export function loginValidate() {
  return [
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5, max: 15 })
      .withMessage("try with the correct password"),
  ];
}

export function userValidate() {
  return [
    body("name")
      .isLength({ min: 3 })
      .withMessage("the name must have minimum length of 3"),
    body("email").isEmail().withMessage("invalid email address"),
    body("password")
      .isLength({ min: 5, max: 15 })
      .withMessage("your password should have min and max length between 5-15"),
  ];
}

export function userUpdateValidate() {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("the name must have minimum length of 3"),
    body("email").optional().isEmail().withMessage("invalid email address"),
    body("password")
      .optional()
      .isLength({ min: 5, max: 15 })
      .withMessage("your password should have min and max length between 5-15"),
  ];
}

