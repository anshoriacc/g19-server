const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');

const { sequelize, User, Profile } = require('../../models');

const register = async (req, res) => {
  const { email, username, password, name, address, phone } = req.body;

  if (!email || !username || !password)
    return res.error(400, 'Email, username, dan password tidak boleh kosong.');

  if (password.length < 8 || password.length > 20)
    return res.error(
      400,
      'Password tidak boleh kurang dari 8 karakter dan lebih dari 20 karakter.'
    );

  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create(
      {
        email,
        username,
        password: hashedPassword,
        profile: {
          name,
          address,
          phone,
        },
      },
      {
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: ['name', 'address', 'phone'],
          },
        ],
        transaction,
      }
    );

    const response = await User.findByPk(createUser.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Profile,
          as: 'profile',
          attributes: ['name', 'address', 'phone'],
        },
      ],
      transaction,
    });

    await transaction.commit();

    return res.success(201, {
      message: 'Success create user.',
      data: response,
    });
  } catch (err) {
    console.log('register error', err);
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

module.exports = register;
