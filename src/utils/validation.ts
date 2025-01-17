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

const emailSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email is not valid" }),
});

const resetPasswordSchema = z.object({
  token: z.string({ required_error: "token is required." }),
  newPassword: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." }),
});

const goalsSchema = z.object({
  FoodAndDrinks: z.number({ required_error: "All fields are required." }),
  Groceries: z.number({ required_error: "All fields are required." }),
  Shopping: z.number({ required_error: "All fields are required." }),
  Transport: z.number({ required_error: "All fields are required." }),
  Entertainment: z.number({ required_error: "All fields are required." }),
  Utilities: z.number({ required_error: "All fields are required." }),
  HealthAndFitness: z.number({ required_error: "All fields are required." }),
  Home: z.number({ required_error: "All fields are required." }),
  Savings: z.number({ required_error: "All fields are required." }),
  Others: z.number({ required_error: "All fields are required." }),
});

const expenseSchema = z.object({
  typeOfExpense: z.string({ required_error: "All fields are required." }),
  amount: z.number({ required_error: "All fields are required." }),
  date: z.date({ required_error: "All fields are required." }),
  category: z.string({ required_error: "All fields are required." }),
  description: z.string({ required_error: "All fields are required." }),
});

export {
  loginSchema,
  registerSchema,
  updateSchema,
  emailSchema,
  resetPasswordSchema,
  goalsSchema,
  expenseSchema,
};

[
  "Food & Drinks",
  "Groceries",
  "Shopping",
  "Transport",
  "Entertainment",
  "Utilities",
  "Health & Fitness",
  "Home",
  "Savings",
  "others",
];
