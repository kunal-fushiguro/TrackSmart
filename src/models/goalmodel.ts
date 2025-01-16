import { Schema, model, models } from "mongoose";

const goalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  goals: {
    FoodAndDrinks: { type: Number, required: true, default: 0 },
    Groceries: { type: Number, required: true, default: 0 },
    Shopping: { type: Number, required: true, default: 0 },
    Transport: { type: Number, required: true, default: 0 },
    Entertainment: { type: Number, required: true, default: 0 },
    Utilities: { type: Number, required: true, default: 0 },
    HealthAndFitness: { type: Number, required: true, default: 0 },
    Home: { type: Number, required: true, default: 0 },
    Savings: { type: Number, required: true, default: 0 },
    Others: { type: Number, required: true, default: 0 },
  },
});

export const Goals = models?.Goal || model("Goal", goalSchema);
