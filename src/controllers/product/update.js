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

const productTypes = ['rental', 'tour', 'carter'];

const update = async (req, res) => {
  const { type, id: productId } = req.params;
  const { body, images } = req;

  if (!productTypes.includes(type.toLowerCase())) return res.error(404);

  const transaction = await sequelize.transaction();
  try {
    if (type.toLowerCase() === 'rental') {
      const {
        name,
        description,
        capacity,
        price,
        driverMandatory,
        transmission,
        quantity,
        oldImages,
      } = body;

      if (
        !name &&
        !description &&
        !capacity &&
        !price &&
        !driverMandatory &&
        !transmission &&
        !quantity &&
        !oldImages &&
        images.length < 1
      ) {
        return res.error(400, 'Isi minimal 1 kolom yang akan diubah.');
      }

      if (
        name ||
        description ||
        capacity ||
        price ||
        driverMandatory ||
        transmission ||
        quantity
      ) {
        await Vehicle.update(
          { ...body },
          { where: { id: productId }, transaction }
        );
      }

      if (oldImages) {
        await VehicleImage.destroy({
          where: {
            [Op.and]: [
              { image_url: { [Op.notIn]: [...oldImages] } },
              { vehicle_id: productId },
            ],
          },
          transaction,
        });
      }

      let imagesStored = [];
      if (images.length > 0) {
        imagesStored = await VehicleImage.bulkCreate(
          images.map((image) => ({ imageUrl: image, vehicle_id: productId })),
          { transaction }
        );
      }

      await transaction.commit();

      return res.success(200, {
        message: 'Success update vehicle.',
        data: {
          id: productId,
          name,
          description,
          capacity,
          price,
          driverMandatory,
          transmission,
          quantity,
          images: [
            ...(oldImages ?? []),
            ...imagesStored.map((image) => image.imageUrl),
          ],
        },
      });
    }

    if (type.toLowerCase() === 'tour') {
      const {
        name,
        description,
        capacity,
        price,
        duration,
        availability,
        highlights,
        itineraries,
        dates,
        oldImages,
      } = body;

      if (
        !name &&
        !description &&
        !capacity &&
        !price &&
        !duration &&
        !availability &&
        !highlights &&
        !itineraries &&
        !dates &&
        !oldImages &&
        images.length < 1
      ) {
        return res.error(400, 'Isi minimal 1 kolom yang akan diubah.');
      }

      if (
        name ||
        description ||
        capacity ||
        price ||
        duration ||
        availability
      ) {
        await Tour.update(
          { ...body },
          { where: { id: productId }, transaction }
        );
      }
      if (oldImages) {
        await TourImage.destroy({
          where: {
            [Op.and]: [
              { image_url: { [Op.notIn]: [...oldImages] } },
              { tour_id: productId },
            ],
          },
          transaction,
        });
      }

      let imagesStored = [];
      if (images.length > 0) {
        imagesStored = await TourImage.bulkCreate(
          images.map((image) => ({ imageUrl: image, tour_id: productId })),
          { transaction }
        );
      }

      if (highlights) {
        await TourHighlight.destroy({
          where: { tour_id: productId },
          transaction,
        });

        await TourHighlight.bulkCreate(
          highlights.map((highlight) => ({
            highlight: highlight,
            tour_id: productId,
          })),
          { transaction }
        );
      }

      if (itineraries) {
        await TourItinerary.destroy({
          where: { tour_id: productId },
          transaction,
        });

        await TourItinerary.bulkCreate(
          itineraries.map((itinerary) => ({
            time: itinerary.time,
            itinerary: itinerary.itinerary,
            tour_id: productId,
          })),
          { transaction }
        );
      }

      if (dates) {
        await TourDate.destroy({
          where: { tour_id: productId },
          transaction,
        });

        await TourDate.bulkCreate(
          dates.map((date) => ({
            startDate: date.startDate,
            endDate: date.endDate,
            tour_id: productId,
          })),
          { transaction }
        );
      }

      await transaction.commit();

      return res.success(200, {
        message: 'Success update tour.',
        data: {
          id: productId,
          name,
          description,
          capacity,
          price,
          duration,
          availability,
          images: [
            ...(oldImages ?? []),
            ...imagesStored.map((image) => image.imageUrl),
          ],
          highlights,
          itineraries,
          dates,
        },
      });
    }

    if (type.toLowerCase() === 'carter') {
      return res.error(404, 'Coming soon');
    }
  } catch (err) {
    console.log('update product error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = update;
