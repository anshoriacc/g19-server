const { Op, ValidationError, UniqueConstraintError } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { sequelize } = require('../config');
const { User, Token, Profile } = require('../models');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ISSUER = process.env.JWT_ISSUER;

const login = async (req, res) => {
  const { emailOrUsername, password, rememberMe } = req.body;

  if (!emailOrUsername)
    return res.error(400, 'Email atau username tidak boleh kosong.');

  if (!password) return res.error(400, 'Password tidak boleh kosong.');

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
      transaction,
    });

    if (!user)
      return res.error(401, 'Email atau username atau password salah.');

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res.error(401, 'Email atau username atau password salah.');

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const jwtOptions = rememberMe
      ? { issuer: ISSUER }
      : { expiresIn: '2d', issuer: ISSUER };

    const token = jwt.sign(payload, SECRET_KEY, jwtOptions);

    const storeToken = await Token.create({ token, userId: user.id });
    console.log('storeToken', storeToken);

    await transaction.commit();

    return res.success(200, {
      message: 'Login sukses.',
      data: { ...payload, token },
    });
  } catch (err) {
    console.log('login error', err);
    await transaction.rollback();
  }
};

const register = async (req, res) => {
  const { email, username, password, name, address, phone } = req.body;

  if (!password) return res.error(400, 'Password tidak boleh kosong.');

  if (password.length < 8)
    return res.error(400, 'Password tidak boleh kurang dari 8 karakter.');

  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create(
      {
        email,
        username,
        password: hashedPassword,
        profile: {
          name: name ?? username,
          address,
          phone,
        },
      },
      {
        include: [{ model: Profile, attributes: ['name', 'address', 'phone'] }],
        transaction,
      }
    );

    const response = await User.findByPk(createUser.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Profile, attributes: ['name', 'address', 'phone'] }],
      transaction,
    });

    await transaction.commit();

    return res.success(201, {
      message: 'Success create admin',
      data: response,
    });
  } catch (err) {
    console.log('register error', err);
    await transaction.rollback();

    if (err instanceof UniqueConstraintError) {
      const { path } = err.errors[0];
      const message = `${
        path.charAt(0).toUpperCase() + path.slice(1)
      } sudah terpakai, gunakan ${path} lain.`;
      return res.error(400, message);
    }
    if (err instanceof ValidationError) {
      return res.error(400, err.errors.map((error) => error.message).join(' '));
    }

    return res.error();
  }
};

module.exports = { login, register };
