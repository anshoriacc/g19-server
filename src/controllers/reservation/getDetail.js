const { midtransSnap } = require('../../helpers');
const {
  sequelize,
  Reservation,
  Vehicle,
  VehicleImage,
  Tour,
  TourImage,
  User,
  Profile,
} = require('../../models');

const getDetail = async (req, res) => {
  const { id: reservationId } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const reservation = await Reservation.findByPk(reservationId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'username'],
          include: [
            {
              model: Profile,
              as: 'user',
              attributes: ['name', 'imageUrl', 'phone', 'address'],
            },
          ],
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['name', 'id'],
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
          attributes: ['name', 'id'],
          include: [
            { model: TourImage, as: 'tourImages', attributes: ['imageUrl'] },
          ],
        },
      ],
      transaction,
    });

    if (!reservation) return res.error(404);

    // const data = reservation.toJSON();
    let { user, vehicle, tour, ...reservationData } = reservation.toJSON();
    user = {
      email: user.email,
      username: user.username,
      name: user.user.name,
      phone: user.user.phone,
      address: user.user.address,
      imageUrl: user.user.imageUrl,
    };
    if (vehicle)
      vehicle = {
        id: vehicle.id,
        name: vehicle.name,
        imageUrl: vehicle.vehicleImages[0].imageUrl,
      };

    if (tour)
      tour = {
        id: tour.id,
        name: tour.name,
        imageUrl: tour.tourImages[0].imageUrl,
      };

    let paymentDetail;
    if (reservationData?.paymentId) {
      paymentDetail = await midtransSnap.transaction.status(
        reservationData?.paymentId
      );
    }

    const data = {
      ...reservationData,
      user,
      vehicle,
      tour,
      paymentDetail,
    };

    await transaction.commit();

    return res.success(200, {
      message: 'Success get reservation detail.',
      data,
    });
  } catch (err) {
    console.log('get reservation detail error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = getDetail;
