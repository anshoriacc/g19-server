const admin = (req, res, next) => {
  const role = req?.user?.role;
  if (role !== 'admin') {
    return res.error(403);
  }

  next();
};

module.exports = { admin };
