const { sequelize, Vehicle, Tour } = require('../../models');

const productTypes = ['rental', 'tour', 'carter'];

const remove = async (req, res) => {
  const { type, id: productId } = req.params;

  if (!productTypes.includes(type.toLowerCase())) return res.error(404);

  const transaction = await sequelize.transaction();
  try {
    let count = 0;

    if (type.toLowerCase() === 'rental') {
      count = await Vehicle.destroy({ where: { id: productId }, transaction });
    }

    if (type.toLowerCase() === 'tour') {
      count = await Tour.destroy({ where: { id: productId }, transaction });
    }

    if (type.toLowerCase() === 'carter') {
      return res.error(404, 'Coming soon');
    }

    if (count === 0) return res.error(404);

    await transaction.commit();

    return res.success(200, {
      message: `Success delete product.`,
    });
  } catch (err) {
    console.log('delete product error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = remove;
