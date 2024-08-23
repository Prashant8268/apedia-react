import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const ResetToken =
  mongoose.models.ResetToken || mongoose.model("ResetToken", resetTokenSchema);
export default ResetToken;
