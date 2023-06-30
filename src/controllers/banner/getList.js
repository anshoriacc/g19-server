const { sequelize } = require('../../config');
const { Banner } = require('../../models');

const getList = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const banners = await Banner.findAll({ transaction });

    await transaction.commit();

    res.success(200, {
      message: 'Success get banner list.',
      data: banners,
    });
  } catch (err) {
    console.log('get banner list error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = getList;
