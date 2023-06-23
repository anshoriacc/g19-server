const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const productRouter = require('./product');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/product', productRouter);

module.exports = router;
