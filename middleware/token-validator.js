const jwt = require("jsonwebtoken");

exports.tokenValidator = (req, res, next) => {
  const fullToken = req.headers.authorization || req.headers.authentication;
  const token = fullToken?.split(" ")[1];
  console.log(`JWT token = ${token}`);
  jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        message: err.message,
      });
    }
    req.userId = decoded.userId;
    next();
  });
};
