const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { sequelize } = require('../../config');
const { User, Token } = require('../../models');

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

    const storeToken = await Token.create(
      { token, userId: user.id },
      { transaction }
    );
    console.log('storeToken', storeToken);

    await transaction.commit();

    return res.success(200, {
      message: 'Login success.',
      data: { ...payload, token },
    });
  } catch (err) {
    console.log('login error', err);
    await transaction.rollback();
    res.error();
  }
};

module.exports = login;
