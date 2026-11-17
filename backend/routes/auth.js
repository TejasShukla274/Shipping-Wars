// AUTH (stub): register/login with bcrypt + JWT. Token carries roles so the UI can show the mode toggle.
const router = require("express").Router();
router.post("/register", (req, res) =>
  res.status(501).json({ todo: "hash password, create User, return JWT" }),
);
router.post("/login", (req, res) =>
  res.status(501).json({ todo: "verify password, return JWT with roles" }),
);
module.exports = router;
