const admin = (req, res, next) => {
  const role = req?.payload?.role;
  if (role !== 'admin') {
    return res.error(403);
  }

  next();
};

module.exports = { admin };
