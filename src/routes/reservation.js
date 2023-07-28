const express = require('express');
const router = express.Router();

const { reservationController } = require('../controllers');

const { verifyJWT, authorize } = require('../middlewares');

router.get('/', verifyJWT, reservationController.getList);
router.get(
  '/stats',
  verifyJWT,
  authorize.admin,
  reservationController.getStats
);
router.get('/:id', verifyJWT, reservationController.getDetail);
router.post('/', verifyJWT, reservationController.create);
router.patch('/:id', verifyJWT, reservationController.update);
router.post('/payment', reservationController.updatePayment);

module.exports = router;
