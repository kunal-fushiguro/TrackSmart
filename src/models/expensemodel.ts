import { Schema, model, models } from "mongoose";

const expenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  typeOfExpense: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  description: { type: String },
});

export const Expense = models?.Expense || model("Expense", expenseSchema);
