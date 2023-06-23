const metadata = (totalData, limit, page) => {
  const totalPage = Math.ceil(totalData / limit);

  return { totalData, page, totalPage, limit };
};

module.exports = metadata;
