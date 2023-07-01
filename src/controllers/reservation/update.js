const { sequelize, Reservation } = require('../../models');

const update = async (req, res) => {
  const { id: reservationId } = req.params;
  const { body } = req;
  const { status } = body;

  const transaction = await sequelize.transaction();
  try {
    if (!status) return res.error(400, 'Isi minimal 1 kolom yang akan diubah.');

    await Reservation.update(
      { status },
      { where: { id: reservationId }, transaction }
    );

    await transaction.commit();

    return res.success(200, {
      message: 'Success update reservation.',
      data: {
        id: reservationId,
        status,
      },
    });
  } catch (err) {
    console.log('update reservation error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = update;
