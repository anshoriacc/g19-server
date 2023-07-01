const { sequelize, Banner } = require('../../models');

const remove = async (req, res) => {
  const { id: bannerId } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const count = await Banner.destroy({
      where: { id: bannerId },
      transaction,
    });
    if (count === 0) return res.error(404);

    await transaction.commit();

    res.success(200, {
      message: 'Success delete banner.',
    });
  } catch (err) {
    console.log('delete banner error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = remove;
