const { sequelize, Banner } = require('../../models');

const getList = async (req, res) => {
  const { isDisplayed } = req.params;

  const whereClause = {};
  if (isDisplayed) {
    whereClause.isDisplayed = true;
  }
  const transaction = await sequelize.transaction();
  try {
    const banners = await Banner.findAll({
      whereClause,
      transaction,
    });

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
