const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  //get current date
  var dateNow = new Date();

  //get bearer token from headers of req object
  const bearerToken = req.rawHeaders[11];
  //get token
  if (bearerToken) {
    //verify the token
    decodedToken = jwt.verify(bearerToken, process.env.SECRET_KEY);
    //if token is expired
    if (decodedToken.exp < dateNow.getTime() / 1000) {
      return res.status(200).send({ message: "Token expired" });
    }
    next();
  } else {
    res.status(200).send({ message: "Token not found" });
  }
}

module.exports = verifyToken;
