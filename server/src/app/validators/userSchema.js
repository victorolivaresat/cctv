const zod = require("zod");

const createUserSchema = zod.object({
  firstName: zod
    .string({
      required_error: "First name is required",
    })
    .min(2)
    .max(255),
  lastName: zod
    .string({
      required_error: "Last name is required",
    })
    .min(2)
    .max(255),
  email: zod
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: zod
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(255),
});

const updateUserSchema = zod.object({
  firstName: zod.string().min(2).max(255),
  lastName: zod.string().min(2).max(255),
  password: zod
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(255),
  confirmPassword: zod
    .string({
      required_error: "Confirm password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(255),
});

module.exports = { createUserSchema, updateUserSchema };
