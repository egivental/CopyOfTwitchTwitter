const authenticatedOnly = (req, res, done) => {
  if (req.user) {
    return done();
  }

  return res.status(401).json({
    message: "You are unauthorized to access this endpoint.",
  });
};

module.exports = authenticatedOnly;
