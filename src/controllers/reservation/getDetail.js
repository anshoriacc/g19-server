const {
  sequelize,
  Reservation,
  Vehicle,
  VehicleImage,
  Tour,
  TourImage,
} = require('../../models');

const getDetail = async (req, res) => {
  const { id: reservationId } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const reservation = await Reservation.findByPk(reservationId, {
      transaction,
    });

    if (!reservation) return res.error(404);

    const data = reservation.toJSON();
    let product;

    if (data.type === 'rental') {
      const vehicle = await Vehicle.findByPk(data.vehicleId, {
        attributes: ['name'],
        include: [
          {
            model: VehicleImage,
            as: 'vehicleImages',
            attributes: ['imageUrl'],
          },
        ],
      });

      const { vehicleImages, ...vehicleData } = vehicle.toJSON();
      product = { ...vehicleData, image: vehicleImages[0].imageUrl };
    }

    if (data.type === 'tour') {
      const tour = await Tour.findByPk(data.tourId, {
        attributes: ['name'],
        include: [
          { model: TourImage, as: 'tourImages', attributes: ['imageUrl'] },
        ],
        transaction,
      });

      const { tourImages, ...tourData } = tour.toJSON();
      product = {
        ...tourData,
        image: tourImages[0].imageUrl,
      };
    }

    data.product = { ...product };

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
