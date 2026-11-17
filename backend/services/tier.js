// Tier rules: Bronze 0-9, Silver 10-19, Gold 20-49, Platinum 50+ verified deliveries.
module.exports = (n) => (n >= 50 ? 3 : n >= 20 ? 2 : n >= 10 ? 1 : 0);
