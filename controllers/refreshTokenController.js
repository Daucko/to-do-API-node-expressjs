const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log('JWT cookie present:', Boolean(cookies?.jwt));
  if (!cookies?.jwt)
    return res.status(401).json({ message: 'Missing JWT cookie' }); // Unauthorized
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden
  //   evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403); // Forbidden
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: decoded.email,
          userId: decoded._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120s' }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
