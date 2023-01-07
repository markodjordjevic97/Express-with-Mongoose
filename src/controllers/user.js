const User = require("../models/user");

exports.getUserById = async (req, res, next) => {
  res.json(await User.findById(req.params.userId));
};

exports.getAllUsers = async (req, res, next) => {
  res.status(200).json(await User.find());
};

exports.createUser = async (req, res, next) => {
  const { username, email } = req.body;
  res.json(await new User(username, email).sa);
};
