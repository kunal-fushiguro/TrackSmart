import { Schema, model, models } from "mongoose";

const goalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  goals: [],
});

export const Expense = models?.Goal || model("Goal", goalSchema);
