const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden
  //   evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    if (err || foundUser.email !== decode.email) return res.sendStatus(403); // Forbidden
    const accessToken = jwt.sign(
      { email: decode.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120s' }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken }