const { Op } = require('sequelize');

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
const { metadata } = require('../../helpers');

const productTypes = ['rental', 'tour', 'carter'];

const getList = async (req, res) => {
  const { type } = req.params;
  const { q, minPrice, maxPrice, sortBy, limit = 10, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  if (!productTypes.includes(type.toLowerCase())) return res.error(404);

  const whereClause = {};
  if (q)
    whereClause.name = sequelize.where(
      sequelize.fn('LOWER', sequelize.col('name')),
      'LIKE',
      `%${q.toLowerCase()}%`
    );
  if (minPrice) whereClause.price = { [Op.gte]: parseInt(minPrice) };
  if (maxPrice) whereClause.price = { [Op.lte]: parseInt(maxPrice) };

  let orderClause = [];
  if (sortBy === 'lowest_price') orderClause[0] = ['price', 'ASC'];
  if (sortBy === 'highest_price') orderClause[0] = ['price', 'DESC'];
  if (sortBy === 'newest') orderClause[0] = ['createdAt', 'DESC'];
  if (sortBy === 'oldest') orderClause[0] = ['createdAt', 'ASC'];

  const transaction = await sequelize.transaction();
  try {
    let totalData, data, meta;
    if (type.toLowerCase() === 'rental') {
      totalData = await Vehicle.count({ where: whereClause, transaction });

      const vehicles = await Vehicle.findAll({
        where: whereClause,
        order: orderClause,
        include: [{ model: VehicleImage, attributes: ['imageUrl'] }],
        limit,
        offset,
        transaction,
      });

      data = vehicles.map((vehicle) => {
        const { vehicleImages, ...rest } = vehicle.toJSON();

        return {
          ...rest,
          images: vehicleImages.map((image) => image.imageUrl),
        };
      });
      meta = metadata(totalData, parseInt(limit), parseInt(page));
    }

    if (type.toLowerCase() === 'tour') {
      totalData = await Tour.count({ where: whereClause, transaction });

      const tours = await Tour.findAll({
        where: whereClause,
        order: orderClause,
        include: [
          { model: TourImage, attributes: ['imageUrl'] },
          {
            model: TourHighlight,
            attributes: ['highlight'],
          },
          {
            model: TourDate,
            attributes: ['startDate', 'endDate'],
          },
          {
            model: TourItinerary,
            attributes: ['time', 'itinerary'],
          },
        ],
        limit,
        offset,
        transaction,
      });

      data = tours.map((tour) => {
        const {
          tourImages,
          tourHighlights,
          tourDates,
          tourItineraries,
          ...rest
        } = tour.toJSON();

        return {
          ...rest,
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
      });
      meta = metadata(totalData, limit, page);
    }

    if (type.toLowerCase() === 'carter') {
      return res.error(404, 'Coming soon');
    }

    await transaction.commit();

    return res.success(200, {
      message: `Success get ${type} list.`,
      data,
      meta,
    });
  } catch (err) {
    console.log('get products error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = getList;
