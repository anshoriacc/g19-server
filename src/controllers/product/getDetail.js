const { Op } = require('sequelize');

const {
  sequelize,
  Vehicle,
  VehicleImage,
  Tour,
  TourDate,
  TourImage,
  TourHighlight,
  TourItinerary,
  Reservation,
} = require('../../models');

const productTypes = ['rental', 'tour', 'carter'];

const getDetail = async (req, res) => {
  const { type, id: productId } = req.params;

  if (!productTypes.includes(type.toLowerCase())) return res.error(404);

  const transaction = await sequelize.transaction();
  try {
    let data;
    if (type.toLowerCase() === 'rental') {
      const { sDate, eDate } = req.query;
      let reservationCount = 0;

      if (sDate && eDate) {
        reservationCount = await Reservation.count({
          where: {
            vehicle_id: productId,
            [Op.or]: [
              { start_date: { [Op.between]: [sDate, eDate] } },
              { end_date: { [Op.between]: [sDate, eDate] } },
            ],
            status: { [Op.or]: ['confirmed', 'on going'] },
          },
          transaction,
        });
      }

      const vehicle = await Vehicle.findByPk(productId, {
        include: [
          {
            model: VehicleImage,
            as: 'vehicleImages',
            attributes: ['imageUrl'],
          },
        ],
        transaction,
      });

      if (!vehicle) return res.error(404);

      const { vehicleImages, ...vehicleData } = vehicle.toJSON();
      data = {
        ...vehicleData,
        reservationCount,
        availableStock: vehicleData.quantity - reservationCount,
        images: vehicleImages.map((image) => image.imageUrl),
      };
    }

    if (type.toLowerCase() === 'tour') {
      const tour = await Tour.findByPk(productId, {
        include: [
          { model: TourImage, as: 'tourImages', attributes: ['imageUrl'] },
          {
            model: TourHighlight,
            as: 'tourHighlights',
            attributes: ['highlight'],
          },
          {
            model: TourDate,
            as: 'tourDates',
            attributes: ['startDate', 'endDate'],
          },
          {
            model: TourItinerary,
            as: 'tourItineraries',
            attributes: ['time', 'itinerary'],
          },
        ],
        transaction,
      });

      if (!tour) return res.error(404);

      const {
        tourImages,
        tourHighlights,
        tourDates,
        tourItineraries,
        ...tourData
      } = tour.toJSON();
      data = {
        ...tourData,
        images: tourImages.map((image) => image.imageUrl),
        highlights: tourHighlights.map((highlight) => highlight.highlight),
        dates: tourDates.map((date) => ({
          startDate: date.startDate,
          endDate: date.endDate,
        })),
        itineraries: tourItineraries.map((itinerary) => ({
          time: itinerary.time,
          itinerary: itinerary.itinerary,
        })),
      };
    }

    if (type.toLowerCase() === 'carter') {
      return res.error(404, 'Coming soon');
    }

    await transaction.commit();

    return res.success(200, {
      message: `Success get ${data.name} detail.`,
      data,
    });
  } catch (err) {
    console.log('get product detail error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = getDetail;
