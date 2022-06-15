const jwt = require("jsonwebtoken");

//configure httponly cookie with the token

const generateToken = async (user, statusCode, res) => {
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const options = {
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
  return token;
};

module.exports.generateToken = generateToken;
