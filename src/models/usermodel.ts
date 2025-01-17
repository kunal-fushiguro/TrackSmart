import { Schema, model, models } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName?: string;

  email: string;
  password: string;
  profilePic?: string;
  monthlyIncome?: number;
  expense?: Schema.Types.ObjectId[];
  goal?: Schema.Types.ObjectId[];
  emailConfrimationCode?: string;
}

const userModel = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    monthlyIncome: { type: Number, default: 0 },
    expense: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
    goal: { type: Schema.Types.ObjectId, ref: "Goal" },
    emailConfrimationCode: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    forgetPasswordTime: { type: Date },
    forgetPasswordCode: { type: Number, default: 1111111 },
  },
  { timestamps: true }
);

const Users = models?.User || model("User", userModel);

export { Users };
export type { IUser };
