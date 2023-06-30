const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const productRouter = require('./product');
const reservationRouter = require('./reservation');
const bannerRouter = require('./banner');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/product', productRouter);
router.use('/reservation', reservationRouter);
router.use('/banner', bannerRouter);

module.exports = router;
