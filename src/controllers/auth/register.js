const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../../config/sequelize');
const { User, Profile } = require('../../models');

const register = async (req, res) => {
  const { email, username, password, name, address, phone } = req.body;

  if (!password) return res.error(400, 'Password tidak boleh kosong.');

  if (password.length < 8)
    return res.error(400, 'Password tidak boleh kurang dari 8 karakter.');

  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create(
      {
        email,
        username,
        password: hashedPassword,
        profile: {
          name: name ?? username,
          address,
          phone,
        },
      },
      {
        include: [{ model: Profile, attributes: ['name', 'address', 'phone'] }],
        transaction,
      }
    );

    const response = await User.findByPk(createUser.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Profile, attributes: ['name', 'address', 'phone'] }],
      transaction,
    });

    await transaction.commit();

    return res.success(201, {
      message: 'Success create admin',
      data: response,
    });
  } catch (err) {
    console.log('register error', err);
    await transaction.rollback();

    if (error instanceof UniqueConstraintError) {
      const { path } = error.errors[0];
      const message = `${
        path.charAt(0).toUpperCase() + path.slice(1)
      } sudah terpakai, gunakan ${path} lain.`;
      return res.error(400, message);
    }
    if (error instanceof ValidationError) {
      return res.error(
        400,
        error.errors.map((error) => error.message).join(' ')
      );
    }

    return res.error();
  }
};

module.exports = register;
