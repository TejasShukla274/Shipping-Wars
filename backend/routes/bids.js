// BIDS: place / modify / withdraw before auction closes, then broadcast the new lowest bid over WebSocket.
const router = require("express").Router();
const Bid = require("../models/Bid");
const Cargo = require("../models/Cargo");
const rank = require("../services/ranking");

// TODO: add JWT auth middleware and check transporter tier >= cargo.minTier
router.post("/:cargoId", async (req, res) => {
  const cargo = await Cargo.findById(req.params.cargoId);
  if (!cargo || cargo.status !== "open" || cargo.auctionEndsAt < new Date())
    return res.status(400).json({ error: "Auction closed" });
  if (req.body.amount > cargo.suggestedPrice * 1.3)
    return res.status(400).json({ error: "Bid above 130% of suggested price" });
  await Bid.findOneAndUpdate(
    { cargo: cargo._id, transporter: req.user.id },
    { amount: req.body.amount },
    { upsert: true },
  );
  const leader = rank(
    await Bid.find({ cargo: cargo._id }).populate("transporter"),
  );
  global.broadcast({
    type: "bid:update",
    cargoId: cargo._id,
    lowest: leader.amount,
  });
  res.json({ ok: true });
});

router.delete("/:cargoId", async (req, res) => {
  // withdraw
  await Bid.deleteOne({ cargo: req.params.cargoId, transporter: req.user.id });
  global.broadcast({ type: "bid:withdrawn", cargoId: req.params.cargoId });
  res.json({ ok: true });
});
module.exports = router;
