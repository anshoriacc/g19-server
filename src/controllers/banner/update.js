const { sequelize, Banner } = require('../../models');

const update = async (req, res) => {
  const { id: bannerId } = req.params;
  const { body, image } = req;
  const { title, url, isDisplayed } = body;

  if (!title && !url && !image) {
    return res.error(400, 'Isi minimal 1 kolom yang akan diubah.');
  }

  const transaction = await sequelize.transaction();
  try {
    await Banner.update(
      { title, url, imageUrl: image, isDisplayed },
      { where: { id: bannerId }, transaction }
    );

    await transaction.commit();

    res.success(200, {
      message: 'Success update banner.',
      data: { title, image, url },
    });
  } catch (err) {
    console.log('update banner error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = update;
