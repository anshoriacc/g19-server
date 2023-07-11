const { UniqueConstraintError, ValidationError } = require('sequelize');

const { sequelize, Profile, User } = require('../../models');

const update = async (req, res) => {
  const { id: userId } = req.user;
  const { body, image } = req;
  const { email, username, password, name, address, phone } = body;

  if (
    !email &&
    !username &&
    !password &&
    !name &&
    !address &&
    !phone &&
    !image
  ) {
    return res.error(400, 'Isi minimal 1 kolom yang akan diubah.');
  }

  const transaction = await sequelize.transaction();
  try {
    if (email || username || password) {
      await User.update({ ...body }, { where: { id: userId }, transaction });
    }
    if (image || name || address || phone) {
      await Profile.update(
        { ...body, imageUrl: image },
        { where: { user_id: userId }, transaction }
      );
    }

    await transaction.commit();

    return res.success(200, {
      message: 'Success update profile.',
      data: {
        id: userId,
        email,
        username,
        password,
        name,
        address,
        phone,
        image,
      },
    });
  } catch (err) {
    console.log('update profile error', err);
    await transaction.rollback();

    if (err instanceof UniqueConstraintError) {
      const { path } = err.errors[0];
      const message = `${
        path.charAt(0).toUpperCase() + path.slice(1)
      } sudah terpakai, gunakan ${path} lain.`;
      return res.error(400, message);
    }
    if (err instanceof ValidationError) {
      return res.error(400, err.errors.map((error) => error.message).join(' '));
    }

    return res.error();
  }
};

module.exports = update;
