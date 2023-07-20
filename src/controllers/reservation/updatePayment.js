const { sequelize, Reservation } = require('../../models');

const updatePayment = async (req, res) => {
  const { order_id, transaction_status, fraud_status } = req.body;

  const transaction = await sequelize.transaction();
  try {
    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        await Reservation.update(
          { status: 'paid' },
          { where: { payment_id: order_id }, transaction }
        );
      }
    } else if (transaction_status === 'settlement') {
      await Reservation.update(
        { status: 'paid' },
        { where: { payment_id: order_id }, transaction }
      );
    } else if (transaction_status === 'deny' || transaction_status === 'expire' || transaction_status === 'failure') {
      await Reservation.update(
        { status: 'cancelled' },
        { where: { payment_id: order_id }, transaction }
      );
    }

    await transaction.commit();

    return res.success(200, {
      message: 'Success update payment.',
      data: { transactionStatus: transaction_status },
    });
  } catch (err) {
    console.log('update payment error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = updatePayment;
