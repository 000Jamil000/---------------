const User = require("../models/User");

class userController {
  async hui(req, res) {
    const { email, password, role } = req.body;
    // if (!email || !password) {
    //   return next(ApiError.badRequest("Некорректный email или password"));
    // }      
    const user = await User.create({
      email,
      role,
      password,
    });
    return res.json({ user });
  }
}

module.exports = new userController();
