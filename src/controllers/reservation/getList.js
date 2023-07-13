const { metadata } = require('../../helpers');
const {
  sequelize,
  Reservation,
  Vehicle,
  User,
  Profile,
  VehicleImage,
  Tour,
  TourImage,
} = require('../../models');

const getList = async (req, res) => {
  const { user } = req;
  const { type, status, sortBy, limit = 10, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = {};
  if (user.role !== 'admin') whereClause.userId = user.id;
  if (type) whereClause.type = type;
  if (status) whereClause.status = status;

  let orderClause = [];
  if (sortBy === 'newest') orderClause[0] = ['createdAt', 'DESC'];
  if (sortBy === 'oldest') orderClause[0] = ['createdAt', 'ASC'];

  const transaction = await sequelize.transaction();
  try {
    const totalData = await Reservation.count({
      where: whereClause,
      transaction,
    });

    const reservations = await Reservation.findAll({
      where: whereClause,
      order: orderClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'username'],
          include: [
            {
              model: Profile,
              as: 'user',
              attributes: ['name', 'imageUrl'],
            },
          ],
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['name'],
          include: [
            {
              model: VehicleImage,
              as: 'vehicleImages',
              attributes: ['imageUrl'],
            },
          ],
        },
        {
          model: Tour,
          as: 'tour',
          attributes: ['name'],
          include: [
            { model: TourImage, as: 'tourImages', attributes: ['imageUrl'] },
          ],
        },
      ],
      limit,
      offset,
      transaction,
    });

    const data = reservations.map((reservation) => {
      let { user, vehicle, tour, ...reservationData } = reservation.toJSON();
      user = {
        email: user.email,
        username: user.username,
        name: user.user.name,
        imageUrl: user.user.imageUrl,
      };
      if (vehicle)
        vehicle = {
          name: vehicle.name,
          imageUrl: vehicle.vehicleImages[0].imageUrl,
        };

      if (tour)
        tour = { name: tour.name, imageUrl: tour.tourImages[0].imageUrl };

      return {
        ...reservationData,
        user,
        vehicle,
        tour,
      };
    });
    const meta = metadata(totalData, parseInt(limit), parseInt(page));

    await transaction.commit();

    return res.success(200, {
      message: 'Success get reservation list',
      data,
      meta,
    });
  } catch (err) {
    console.log('get reservation list error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = getList;
