require("dotenv").config();
const User = require("../models/User");
const Profile = require("../models/Profile");
const Passenger = require("../models/Passenger");
const Managers = require("../models/Managers");
const Admin = require("../models/Admin");
const PassportData = require("../models/PassportData");
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
      return next(ApiError.badRequest("Пользователь не зарегистрирован"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return next(ApiError.badRequest("Пароль неверный"));
    }

    const token = generateJwt(user.id, user.password, user.role);
    return res.json({ token });
  }
  async logout(req, res) {
    res.json({ message: "Вы вышли с аккаунта" });
  }

  async check(req, res) {
    const token = generateJwt(req.user._id, req.user.email, req.user.role);
    let redirectUrl;
    if (req.user.role === "MANAGER") {
      redirectUrl = "http://localhost:5000/HTML/Manager/profileManager.html";
    } else if (req.user.role === "ADMIN") {
      redirectUrl = "http://localhost:5000/HTML/Admin/profileAdmin.html";
    } else {
      redirectUrl = "http://localhost:5000/HTML/profilePerson.html";
    }
    return res.json({ token, redirectUrl });
  }

  async addFullNameAndPost(req, res, next) {
    const { firstName, lastName, middleName, post } = req.body;

    if (!firstName || !middleName || !post) {
      return next(ApiError.badRequest("Не все данные указаны"));
    }

    try {
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        profile = new Profile({ userId });
      }

      let manager = await Managers.findOne({ userId });
      if (!manager) {
        manager = new Managers({
          userId,
          firstName,
          lastName,
          middleName,
          post,
        });
      } else {
        manager.firstName = firstName;
        manager.lastName = lastName;
        manager.middleName = middleName;
        manager.post = post;
      }

      await manager.save();

      profile.ManagerId = manager._id;

      await profile.save();

      res.status(201).json({ message: "Данные успешно сохранены" });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Произошла ошибка при сохранении данных"));
    }
  }

  async addFullNameAndPassport(req, res, next) {
    const { firstName, lastName, middleName, dateOfBirth, passport } = req.body;

    if (!firstName || !lastName || !passport) {
      return next(ApiError.badRequest("Не все данные указаны"));
    }

    const { series, number, divisionCode, issuedBy } = passport;

    if (!series || !number || !divisionCode || !issuedBy) {
      return next(ApiError.badRequest("Не все данные паспорта указаны"));
    }

    const userId = req.user.id;

    try {
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        profile = new Profile({ userId });
      }

      let passenger = await Passenger.findOne({ userId });
      if (!passenger) {
        passenger = new Passenger({
          userId,
          firstName,
          lastName,
          middleName,
          dateOfBirth,
        });
      } else {
        passenger.firstName = firstName;
        passenger.lastName = lastName;
        passenger.middleName = middleName;
        passenger.dateOfBirth = dateOfBirth;
      }

      await passenger.save();

      let passportData = await PassportData.findOne({
        passengerId: passenger._id,
      });
      if (!passportData) {
        passportData = new PassportData({
          passengerId: passenger._id,
          series,
          number,
          divisionCode,
          issuedBy,
        });
      } else {
        passportData.series = series;
        passportData.number = number;
        passportData.divisionCode = divisionCode;
        passportData.issuedBy = issuedBy;
      }

      await passportData.save();

      profile.passengerId = passenger._id;
      profile.passportId = passportData._id;

      await profile.save();

      res.status(201).json({ message: "Данные успешно сохранены" });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Произошла ошибка при сохранении данных"));
    }
  }

  async getUserProfile(req, res, next) {
    const userId = req.user.id;

    try {
      const passenger = await Passenger.findOne({ userId }).populate("userId");
      const passport = await PassportData.findOne({
        passengerId: passenger._id,
      });

      if (!passenger || !passport) {
        return next(ApiError.notFound("Профиль пользователя не найден"));
      }

      res.json({
        user: {
          email: passenger.userId.email,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          middleName: passenger.middleName,
          dateOfBirth: passenger.dateOfBirth,
        },
        passport: {
          series: passport.series,
          number: passport.number,
          divisionCode: passport.divisionCode,
          issuedBy: passport.issuedBy,
        },
      });
    } catch (error) {
      console.error(error);
      next(
        ApiError.internal("Произошла ошибка при получении профиля пользователя")
      );
    }
  }

  async getManagerProfile(req, res, next) {
    const userId = req.user.id;

    try {
      const manager = await Managers.findOne({ userId }).populate("userId");

      if (!manager) {
        return next(ApiError.notFound("Профиль пользователя не найден"));
      }

      res.json({
        user: {
          post: manager.post,
          firstName: manager.firstName,
          lastName: manager.lastName,
          middleName: manager.middleName,
        },
      });
    } catch (error) {
      console.error(error);
      next(
        ApiError.internal("Произошла ошибка при получении профиля пользователя")
      );
    }
  }

  async getAdminProfile(req, res, next) {
    const userId = req.user.id;

    try {
      const admin = await Admin.findOne({ userId }).populate("userId");

      if (!admin) {
        return next(ApiError.notFound("Профиль пользователя не найден"));
      }

      res.json({
        user: {
          post: admin.post,
          firstName: admin.firstName,
          lastName: admin.lastName,
          middleName: admin.middleName,
        },
      });
    } catch (error) {
      console.error(error);
      next(
        ApiError.internal("Произошла ошибка при получении профиля пользователя")
      );
    }
  }

  async addFullNameAndPostAdmin(req, res, next) {
    const { firstName, lastName, middleName, post } = req.body;

    if (!firstName || !middleName || !post) {
      return next(ApiError.badRequest("Не все данные указаны"));
    }
    const userId = req.user.id;

    try {
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        profile = new Profile({ userId });
      }

      let admin = await Admin.findOne({ userId });
      if (!passenger) {
        admin = new Admin({
          userId,
          firstName,
          lastName,
          middleName,
          post,
        });
      } else {
        admin.firstName = firstName;
        admin.lastName = lastName;
        admin.middleName = middleName;
        admin.post = post;
      }

      await admin.save();

      profile.AdminId = admin._id;

      await profile.save();

      res.status(201).json({ message: "Данные успешно сохранены" });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Произошла ошибка при сохранении данных"));
    }
  }

  async deleteUser(req, res, next) {
    const userId = req.user.id;
    try {
      await Profile.deleteOne({ userId: userId });

      await User.deleteOne({ _id: userId });

      const passenger = await Passenger.findOne({ userId: userId });
      if (passenger) {
        const passport = await PassportData.findOne({
          passengerId: passenger._id,
        });
        if (passport) {
          await PassportData.deleteOne({ _id: passport._id });
        }
        await Passenger.deleteOne({ _id: passenger._id });
      }

      console.log("Данные пользователя удалены успешно.");
      res.json({ message: "Данные пользователя удалены успешно." });
    } catch (error) {
      console.error(
        "Произошла ошибка при удалении данных пользователя:",
        error
      );
      return next(
        ApiError.badRequest(
          "Произошла ошибка при удалении данных пользователя:",
          error
        )
      );
    }
  }
}

module.exports = new userController();
