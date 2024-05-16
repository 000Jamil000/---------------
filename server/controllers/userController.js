const User = require("../models/User");

class userController {
  async createUser(req, res) {
    const { email, password, role } = req.body;
    const user = await User.create({
      email,
      role,
      password,
    });
    return res.json({ user });
  }
}

module.exports = new userController();
