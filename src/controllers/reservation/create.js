const { sequelize } = require('../../config');
const { midtransSnap } = require('../../helpers');
const { Reservation } = require('../../models');

const create = async (req, res) => {
  const { body, user } = req;
  const {
    type,
    startDate,
    endDate,
    total,
    payment,
    addOn,
    vehicleId,
    tourId,
    carterId,
  } = body;

  if (
    !type ||
    !startDate ||
    !endDate ||
    !total ||
    !payment ||
    (!vehicleId && !tourId && !carterId)
  ) {
    return res.error(400, 'Semua kolom wajib diisi');
  }

  const transaction = await sequelize.transaction();
  try {
    const status = user.role === 'admin' ? 'confirmed' : 'pending';

    const createReservation = await Reservation.create(
      {
        userId: user.id,
        type,
        startDate,
        endDate,
        total,
        payment: user.role === 'admin' ? 'cash' : payment,
        addOn,
        vehicleId,
        tourId,
        carterId,
        status,
      },
      { transaction }
    );

    await transaction.commit();

    const parameter = {
      transaction_details: {
        order_id: createReservation.paymentId,
        gross_amount: parseInt(total),
      },
      credit_card: {
        secure: true,
      },
    };

    let paymentUrl = '';
    if (createReservation.payment === 'cashless') {
      paymentUrl = await midtransSnap.createTransactionRedirectUrl(parameter);
    }

    return res.success(201, {
      message: 'Success create reservation.',
      data: { ...createReservation.toJSON(), paymentUrl },
    });
  } catch (err) {
    console.log('create transaction error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = create;
