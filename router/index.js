const express = require("express");
const APIResponseFormat = require("../utils/APIResponseFormat");
const { encrypt, decrypt, generateSalt, hashPassword, generateToken, decodeToken } = require("../utils/helper");
const db = require("../db/models");
const { Op } = require("sequelize");
const controller = require("../controller/index");

const router = express.Router();

// Home route
router.get("/", (req, res) => {
	res.send("Hello World!");
});

// set password route
router.post("/set-password", controller.setPassword);

// Login page get
router.get("/login", controller.getLoginPage);

// Login post
router.post("/login", controller.login);

// validate session 
router.post("/validate-token", controller.validateToken);

// get forgot password page
router.get("/forgot-password", controller.getForgotPasswordPage);

// post forgot password
router.post("/forgot-password", controller.forgotPassword);

// get otp page
router.get("/verify", controller.getVerificationCodePage);

// post otp
router.post("/verify", controller.verifyVerificationCode);

// error route
router.use("*", (req, res) => {
	return res.render('error', { error: "Page not found" });
});

module.exports = router;
