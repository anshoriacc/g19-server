const dayjs = require('dayjs');
const { sequelize, Reservation } = require('../../models');
const { Op } = require('sequelize');

const getStats = async (req, res) => {
  const { year = dayjs().year() } = req.query;

  const transaction = await sequelize.transaction();
  try {
    const data = await Reservation.findAll({
      where: {
        [Op.and]: sequelize.where(
          sequelize.fn('date_part', 'YEAR', sequelize.col('created_at')),
          year
        ),
        status: { [Op.notIn]: ['cancelled', 'pending'] },
      },

      attributes: [
        [sequelize.fn('SUM', sequelize.col('total')), 'total'],
        [
          sequelize.fn('date_trunc', 'month', sequelize.col('created_at')),
          'month',
        ],
        [sequelize.literal(`COUNT(*)`), 'count'],
      ],
      order: [[sequelize.literal('month'), 'ASC']],
      group: 'month',
    });

    await transaction.commit();

    console.log(
      'data',
      [...Array(12)].map((el, index) => ({
        month: dayjs().month(index).format('MMMM'),
        total:
          data.find((data) => dayjs(data.month).month() === index)?.total ?? 0,
        count:
          data.find((data) => dayjs(data.month).month() === index)?.count ?? 0,
      }))
    );

    const formattedData = data.map((data) => {
      const jsonData = data.toJSON();
      return { ...jsonData, month: dayjs(jsonData.month).month() };
    });

    const resData = [...Array(12)].map((el, index) => ({
      month: dayjs().month(index).format('MMMM'),
      total: formattedData.find((data) => data.month === index)?.total
        ? parseInt(formattedData.find((data) => data.month === index)?.total)
        : 0,
      count: formattedData.find((data) => data.month === index)?.count
        ? parseInt(formattedData.find((data) => data.month === index)?.count)
        : 0,
    }));

    const total = resData.reduce(
      (accumulator, curValue) => accumulator + curValue.total,
      0
    );

    const totalCount = resData.reduce(
      (accumulator, curValue) => accumulator + curValue.count,
      0
    );

    return res.success(200, {
      message: `Success get statistics ${year}`,
      data: { total, count: totalCount, data: resData },
    });
  } catch (err) {
    console.log('get statistics error', err);
    await transaction.rollback();

    return res.error();
  }
};

module.exports = getStats;
