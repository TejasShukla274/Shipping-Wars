// ONE account, MANY roles: roles can contain 'owner', 'transporter' and/or 'admin',
// so the frontend mode toggle needs no second login.
const { Schema, model } = require("mongoose");
module.exports = model(
  "User",
  new Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    roles: { type: [String], default: ["owner"] },
    language: { type: String, default: "en" },
    verified: { type: Boolean, default: false }, // set by admin after document approval
    completedDeliveries: { type: Number, default: 0 }, // drives tier (see services/tier.js)
    rating: Number,
    onTimePct: Number,
    cancelRate: Number,
    performanceScore: Number,
    vehicles: [
      {
        regNo: String,
        type: String,
        rcExpiry: Date,
        insuranceExpiry: Date,
        pucExpiry: Date,
        permitExpiry: Date,
        driverName: String,
        licenceExpiry: Date,
      },
    ],
  }),
);
