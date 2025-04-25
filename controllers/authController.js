const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password are required' });
  const foundUser = await User.findOne({ email: email }).exec();

  if (!foundUser) {
    console.log(`could not find user with the ${email}`);
    return res.sendStatus(401); // Unauthorized
  }
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  console.log('Password match:', match);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          userId: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120s' }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          userId: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    // saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    // creating secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: true, // set to true if using https
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = { handleLogin };
