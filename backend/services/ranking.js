// Winner selection: lowest amount wins. Ties -> better rating, then on-time %,
// then LOWER cancellation rate, then higher performance score (mirrors js/transporter.js lead()).
module.exports = (bids) =>
  [...bids].sort(
    (a, b) =>
      a.amount - b.amount ||
      b.transporter.rating - a.transporter.rating ||
      b.transporter.onTimePct - a.transporter.onTimePct ||
      a.transporter.cancelRate - b.transporter.cancelRate ||
      b.transporter.performanceScore - a.transporter.performanceScore,
  )[0];
