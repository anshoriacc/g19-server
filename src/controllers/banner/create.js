const { sequelize, Banner } = require('../../models');

const create = async (req, res) => {
  const { body, image } = req;
  const { title, url } = body;

  if (!title || !image) {
    return res.error(400, 'Judul dan gambar wajib diisi.');
  }

  const transaction = await sequelize.transaction();
  try {
    const createBanner = await Banner.create(
      { title, url, imageUrl: image },
      { transaction }
    );

    await transaction.commit();

    res.success(201, { message: 'Success create banner.', data: createBanner });
  } catch (err) {
    console.log('create banner error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = create;
