const jwt = require("jsonwebtoken");
const config = require("../config/auth");

module.exports = async(req, res, next) => {
     
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(404).json({
            status: 0,
            message: "Tidak ada token"
        });
    }
  
    jwt.verify(authHeader, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(404).json({
            status: 0,
            message: "Token tidak sah!"
        });
      }
      req.id_user = decoded.id_user;
      next();
    });
}