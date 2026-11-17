// ENTRY POINT: Express REST API + WebSocket server for live bidding.
// Run: npm install && node server.js   (needs MONGO_URI and JWT_SECRET in .env)
require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { WebSocketServer } = require("ws");

const app = express();
app.use(express.json());

// REST routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bids", require("./routes/bids"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

// Broadcast helper: call broadcast({type:'bid:update', ...}) after every accepted bid
global.broadcast = (msg) =>
  wss.clients.forEach((c) => c.readyState === 1 && c.send(JSON.stringify(msg)));

mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(process.env.PORT || 4000, () =>
    console.log("API + WebSocket running"),
  );
});
