const User = require('../models/User');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  // is refreshToken in DB?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
    return res.sendStatus(204); // No content
  }

  // Delete refreshToken in DB
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
  res.sendStatus(204); // No content
};

module.exports = { handleLogout };
