require("dotenv").config();
const User = require("../models/User");
const Profile = require("../models/Profile");
const Passenger = require("../models/Passenger");
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
      return next(ApiError.intenal("Пользователь не зарегистрирован"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return next(ApiError.badRequest("Пароль неверный"));
    }

    const token = generateJwt(user.id, user.password, user.role);
    return res.json({ token });
  }

  async check(req, res) {
    const token = generateJwt(req.user._id, req.user.email, req.user.role);
    return res.json({ token });
  }

  async addFullNameAndPassport(req, res, next) {
    const { firstName, lastName, middleName, dateOfBirth, passport } = req.body;

    const userId = req.user.id;
    if (!firstName || !lastName || !dateOfBirth || !passport) {
      return next(ApiError.badRequest("Не все данные указаны"));
    }

    const { series, number, divisionCode, issuedBy } = passport;

    if (!series || !number || !divisionCode || !issuedBy) {
      return next(ApiError.badRequest("Не все данные паспорта указаны"));
    }

    try {
      // Проверяем существование записи профиля
      let profile = await Profile.findOne({ userId });

      if (!profile) {
        // Если записи профиля нет, создаем новую
        profile = new Profile({ userId });
      }

      // Проверяем существование пассажира
      let passenger = await Passenger.findOne({ userId });

      if (!passenger) {
        // Если пассажира нет, создаем нового
        passenger = new Passenger({
          userId,
          firstName,
          lastName,
          middleName,
          dateOfBirth,
        });
      } else {
        // Если пассажир существует, обновляем его данные
        passenger.firstName = firstName;
        passenger.lastName = lastName;
        passenger.middleName = middleName;
        passenger.dateOfBirth = dateOfBirth;
      }

      // Сохраняем или обновляем пассажира
      await passenger.save();

      // Проверяем существование паспорта
      let passportData = await PassportData.findOne({
        passengerId: passenger._id,
      });

      if (!passportData) {
        // Если паспорта нет, создаем новый
        passportData = new PassportData({
          passengerId: passenger._id,
          series,
          number,
          divisionCode,
          issuedBy,
        });
      } else {
        // Если паспорт существует, обновляем его данные
        passportData.series = series;
        passportData.number = number;
        passportData.divisionCode = divisionCode;
        passportData.issuedBy = issuedBy;
      }

      // Сохраняем или обновляем паспорт
      await passportData.save();

      // Обновляем данные в профиле
      profile.passengerId = passenger._id;
      profile.passportId = passportData._id;

      // Сохраняем или обновляем профиль
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
}

module.exports = new userController();
