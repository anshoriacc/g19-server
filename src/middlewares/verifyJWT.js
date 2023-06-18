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

    jwt.verify(token, SECRET_KEY, { issuer: ISSUER }, (err, payload) => {
      if (err) return res.error(403);
      req.user = payload;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.error();
  }
};

module.exports = verifyJWT;
