const User = require("../models/usersModel");

class UserManager {

  async GetUserById(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      res.send({
        message: "User fetched successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      res.send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  };

  // get all users
  async GetAllClients(req, res) {
    try {
      // if the user is an admin, dont display him in the list of users
      const users = await User.find({ isAdmin: false });
      res.send({
        message: "Users fetched successfully",
        success: true,
        data: users,
      });
    } catch (error) {
      res.send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  };
}

module.exports = UserManager;
