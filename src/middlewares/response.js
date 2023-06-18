const responseMiddleware = (req, res, next) => {
  res.success = (status, { message, ...data }) => {
    const response = {
      status: status,
      message: message ?? 'Success',
      ...data,
    };
    return res.status(status).json(response);
  };

  res.error = (status, message) => {
    switch (status) {
      case 400:
        res.status(400).json({
          status: 400,
          message: message ?? 'Bad request',
        });
        break;
      case 401:
        res.status(401).json({
          status: 401,
          message: message ?? 'Unauthorized',
        });
        break;
      case 403:
        res.status(403).json({
          status: 403,
          message: message ?? 'Forbidden',
        });
        break;
      case 404:
        res.status(404).json({
          status: 404,
          message: message ?? 'Not found',
        });
        break;
      default:
        res.status(500).json({
          status: 500,
          message: message ?? 'Internal server error',
        });
    }
  };

  next();
};

module.exports = responseMiddleware;
