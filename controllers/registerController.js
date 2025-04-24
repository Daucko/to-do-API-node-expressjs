const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password are required' });
  // Check for duplicate email in the db
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create and store the new user
    const result = await User.create({
      email: email,
      password: hashedPassword,
    });
    console.log(result);
    res
      .status(201)
      .json({ message: `New user ${email} successfully created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
