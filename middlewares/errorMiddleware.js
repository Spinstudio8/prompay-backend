const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports.errorHandler = errorHandler;
module.exports.notFound = notFound;
