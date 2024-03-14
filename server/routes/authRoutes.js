const express = require("express");
const router = express.Router(); // Use express.Router() for creating route handlers
const AuthController = require("../Controllers/AuthManager");
const authController = new AuthController();

router.post("/create-user", (req, res) => authController.CreateUser(req, res));
router.post("/login", (req, res) => authController.Login(req, res));
router.post("/requestPasswordReset", (req, res) => authController.ResetPassword(req, res));
router.post("/resetPassword/:userId/:resetString", (req, res) => authController.UpdatePassword(req, res));

module.exports = router;