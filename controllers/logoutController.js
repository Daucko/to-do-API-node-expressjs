const User = require('../models/User');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return status(204).json({ message: 'No content' });
  const refreshToken = cookies.jwt;

  // is refreshToken in DB?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', https: true });
    return res.status(204).json({ message: 'No content' });
  }

  // Delete refreshToken in DB
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', https: true });
  res.status(204).json({ message: 'No content' });
};

module.exports = { handleLogout };
