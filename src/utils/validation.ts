import { z } from "zod";

const registerSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required." })
    .min(3, { message: "First name must be at least 3 characters long." }),
  lastName: z.string().optional(),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." }),
  profilePic: z.string().optional(),
  monthlyIncome: z
    .number()
    .int({ message: "Monthly income must be an integer." })
    .nonnegative({ message: "Monthly income cannot be negative." })
    .default(0)
    .optional(),
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address." }),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." }),
});

const updateSchema = z.object({
  profilePic: z
    .string({ required_error: "Profile picture url is required." })
    .url({ message: "Profile picture url must be valid." }),
  monthlyIncome: z.number({ required_error: "Income is required" }),
});

export { loginSchema, registerSchema, updateSchema };
