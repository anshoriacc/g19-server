const express = require('express');
const router = express.Router();

const { reservationController } = require('../controllers');

const { verifyJWT } = require('../middlewares');

router.get('/', verifyJWT, reservationController.getList);
router.get('/:id', verifyJWT, reservationController.getDetail);
router.post('/', verifyJWT, reservationController.create);
router.patch('/:id', verifyJWT, reservationController.update);
router.post('/payment', reservationController.updatePayment);

module.exports = router;
