require("dotenv").config();
const User = require("../models/User");
const Profile = require("../models/Profile");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id: id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};
class userController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или пароль"));
    }

    const candidate = await User.findOne({ email });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    await Profile.create({ userId: user._id });

    const token = generateJwt(user._id, user.email, user.role);

    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(ApiError.intenal("Пользователь не зарегистрирован"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return next(ApiError.badRequest("Пароль неверный"));
    }

    const token = generateJwt(user.email, user.password, user.role);
    return res.json({ token });
  }

  async check(req, res) {
    const token = generateJwt(req.user._id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

module.exports = new userController();
