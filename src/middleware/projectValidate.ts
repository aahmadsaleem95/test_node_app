import { body } from "express-validator";

export function createProjectValidate() {
  return [
    body("title")
      .isLength({ min: 5 })
      .withMessage("the project name must have minimum length of 3"),
    body("status").isLength({ min: 5 }).withMessage("status is required"),
  ];
}

export function updateProjectValidate() {
  return [
    body("title")
      .optional()
      .isLength({ min: 5 })
      .withMessage("the project name must have minimum length of 3"),
    body("status")
      .optional()
      .isLength({ min: 5 })
      .withMessage("status is required"),
  ];
}
