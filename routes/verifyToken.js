const jwt = require("jsonwebtoken");

//Middleware function bunu istediğimiz route'a ekleyebiliriz. tokensız access olmasın istediğimiz
module.exports = function (req, res, next) {
  const token = req.header("auth-token"); //postmande headerda auth-token var mı diye check ediyoruz
  if (!token) return res.status(401).send("Access Denied"); //if there is no token, access denied

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};
