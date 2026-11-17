// A shipment posted by a cargo owner; becomes a reverse-auction listing.
const { Schema, model } = require("mongoose");
module.exports = model(
  "Cargo",
  new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    pickup: String,
    destination: String,
    weightTonnes: Number,
    category: String,
    vehicleType: String,
    distanceKm: Number,
    suggestedPrice: Number,
    minTier: { type: Number, default: 0 }, // 0 Bronze .. 3 Platinum
    deadline: Date,
    auctionEndsAt: Date,
    status: {
      type: String,
      enum: ["open", "awarded", "in_transit", "delivered"],
      default: "open",
    },
  }),
);
