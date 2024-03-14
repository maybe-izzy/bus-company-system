const express = require("express");
const router = express.Router();
const UserManager = require("../Controllers/UserManager");
const authMiddleware = require("../middlewares/authMiddleware");

const userManager = new UserManager();

router.get("/get-all-users", authMiddleware, (req, res) => userManager.getAllClients(req, res));
router.get("/:userId", (req, res) => userManager.GetUserById(req, res));

module.exports = router;
