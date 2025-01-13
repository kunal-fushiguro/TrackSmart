import { Schema, model, models } from "mongoose";

const userModel = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    token: { type: String },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    monthlyIncome: { type: Number, default: 0 },
    expense: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
    goal: [{ type: Schema.Types.ObjectId, ref: "Goal" }],
  },
  { timestamps: true }
);

export const Users = models?.User || model("User", userModel);
