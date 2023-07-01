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
        include: [
          {
            model: VehicleImage,
            as: 'vehicleImages',
            attributes: ['imageUrl'],
          },
        ],
        limit,
        offset,
        transaction,
      });

      data = vehicles.map((vehicle) => {
        const { vehicleImages, ...vehicleData } = vehicle.toJSON();

        return {
          ...vehicleData,
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
          ...tourData
        } = tour.toJSON();

        return {
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
    console.log('get product list error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = getList;
