const { sequelize } = require('../../config');
const {
  Vehicle,
  VehicleImage,
  Tour,
  TourDate,
  TourImage,
  TourHighlight,
  TourItinerary,
} = require('../../models');

const productTypes = ['rental', 'tour', 'carter'];

const create = async (req, res) => {
  const { type } = req.params;
  const { body, images } = req;

  if (!productTypes.includes(type.toLowerCase())) return res.error(404);

  const transaction = await sequelize.transaction();
  try {
    const { name, description, capacity, price } = body;
    if (!name || !description || !capacity || !price || images.length < 1) {
      return res.error(400, 'Semua kolom wajib diisi.');
    }

    if (type.toLowerCase() === 'rental') {
      const { driverMandatory, transmission, quantity } = body;

      if (!quantity || !driverMandatory || !transmission) {
        return res.error(400, 'Semua kolom wajib diisi.');
      }

      const createVehicle = await Vehicle.create(
        {
          name,
          description,
          capacity,
          price,
          driverMandatory,
          transmission,
          quantity,
          vehicleImages: images.map((image) => ({ imageUrl: image })),
        },
        {
          include: [{ model: VehicleImage }],
          transaction,
        }
      );

      await transaction.commit();

      return res.success(201, {
        message: 'Success create vehicle.',
        data: createVehicle,
      });
    }

    if (type.toLowerCase() === 'tour') {
      const { duration, highlights, itineraries, dates, availability } = body;

      if (
        !duration ||
        !availability ||
        (availability === 'scheduled' && !dates)
      ) {
        return res.error(400, 'Semua kolom wajib harap diisi.');
      }

      const bodyCreate = {
        name,
        description,
        capacity,
        price,
        duration,
        availability,
        tourImages: images.map((image) => ({ imageUrl: image })),
      };

      const optionalIncludes = [];
      if (highlights) {
        bodyCreate.tourHighlights = highlights.map((highlight) => ({
          highlight,
        }));
        optionalIncludes.push({
          model: TourHighlight,
          attributes: ['highlight'],
        });
      }

      if (itineraries) {
        bodyCreate.tourItineraries = itineraries.map((itinerary) => ({
          time: itinerary.time,
          itinerary: itinerary.itinerary,
        }));
        optionalIncludes.push({
          model: TourItinerary,
          attributes: ['time', 'itinerary'],
        });
      }

      if (dates) {
        bodyCreate.tourDates = dates.map((date) => ({
          startDate: date.startDate,
          endDate: date.endDate,
        }));
        optionalIncludes.push({
          model: TourDate,
          attributes: ['startDate', 'endDate'],
        });
      }

      const createTour = await Tour.create(
        {
          ...bodyCreate,
        },
        {
          include: [
            { model: TourImage, attributes: ['imageUrl'] },
            ...optionalIncludes,
          ],
          transaction,
        }
      );

      await transaction.commit();

      return res.success(201, {
        message: 'Success create tour.',
        data: createTour,
      });
    }

    if (type.toLowerCase() === 'carter') {
      return res.error(404, 'Coming soon');
    }
  } catch (err) {
    console.log('create product error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = create;
