// One bid per transporter per cargo (upsert = modify, delete = withdraw).
const { Schema, model } = require("mongoose");
module.exports = model(
  "Bid",
  new Schema(
    {
      cargo: { type: Schema.Types.ObjectId, ref: "Cargo", index: true },
      transporter: { type: Schema.Types.ObjectId, ref: "User" },
      amount: Number,
    },
    { timestamps: true },
  ),
);
