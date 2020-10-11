const User = require("../models/userModel");

// Signup
exports.register = async (req, res) => {
  res.render("register");
};
