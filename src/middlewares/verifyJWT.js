const jwt = require('jsonwebtoken');

const { Token } = require('../models');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ISSUER = process.env.JWT_ISSUER;

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.error(401, 'Silakan login terlebih dahulu.');

  const token = authHeader.split(' ')[1];

  try {
    const tokenCheck = await Token.findOne({ where: { token } });
    if (!tokenCheck) return res.error(401, 'Silakan login terlebih dahulu.');

    const payload = jwt.verify(token, SECRET_KEY, { issuer: ISSUER });
    const { id, email, username, role } = payload;
    req.user = { id, email, username, role };

    next();
  } catch (err) {
    console.log('verifyJWT error', err);
    if (err instanceof jwt.TokenExpiredError) {
      return res.error(401, 'Session expired, silakan login kembali.');
    }

    return res.error();
  }
};

module.exports = verifyJWT;
