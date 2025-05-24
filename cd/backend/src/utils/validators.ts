import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({ errors: errors.array() });
  };
};

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password").trim().isLength({ min: 6 }).withMessage("Password is required"),
];

export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should contain at least 6 characters"),
];

export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message is required"),
];

export const journalValidator = [
  body("content").trim().notEmpty().withMessage("Journal content is required"),
];

export const moodCreateValidator = [
  body("mood").notEmpty().withMessage("Mood is required"),
  body("sentiment").isFloat({ min: 0, max: 1 }).withMessage("Sentiment score must be between 0 and 1"),
  body("notes").optional().isString(),
  body("chatContext").optional().isString(),
];
