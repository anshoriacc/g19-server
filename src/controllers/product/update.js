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

const productTypes = ['rental', 'tour', 'carter'];

const update = async (req, res) => {
  const { type, id: productId } = req.params;
  const { body, images } = req;
  console.log('body images', body.images);
  console.log('images', images);

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
              { imageUrl: { [Op.notIn]: [...oldImages] } },
              { vehicleId: productId },
            ],
          },
          transaction,
        });
      }

      let imagesStored = [];
      if (images.length > 0) {
        imagesStored = await VehicleImage.bulkCreate(
          images.map((image) => ({ imageUrl: image, vehicleId: productId })),
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
              { imageUrl: { [Op.notIn]: [...oldImages] } },
              { tourId: productId },
            ],
          },
          transaction,
        });
      }

      let imagesStored = [];
      if (images.length > 0) {
        imagesStored = await TourImage.bulkCreate(
          images.map((image) => ({ imageUrl: image, tourId: productId })),
          { transaction }
        );
      }

      if (highlights) {
        await TourHighlight.destroy({
          where: { tourId: productId },
          transaction,
        });

        await TourHighlight.bulkCreate(
          highlights.map((highlight) => ({
            highlight: highlight,
            tourId: productId,
          })),
          { transaction }
        );
      }

      if (itineraries) {
        await TourItinerary.destroy({
          where: { tourId: productId },
          transaction,
        });

        await TourItinerary.bulkCreate(
          itineraries.map((itinerary) => ({
            time: itinerary.time,
            itinerary: itinerary.itinerary,
            tourId: productId,
          })),
          { transaction }
        );
      }

      if (dates) {
        await TourDate.destroy({
          where: { tourId: productId },
          transaction,
        });

        await TourDate.bulkCreate(
          dates.map((date) => ({
            startDate: date.startDate,
            endDate: date.endDate,
            tourId: productId,
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
