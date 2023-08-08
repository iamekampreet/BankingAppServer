const jwt = require("jsonwebtoken");

exports.tokenValidator = (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: err.message,
      });
    }
    next();
  });
};
