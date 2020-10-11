// Require modules
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.register);

// Export module
module.exports = router;
