// middlewares/auth-middleware.js

const User = require('../models/User');

// Middleware to check for existing username
const checkUniqueName = async (req, res, next) => {
  const { name } = req.body;
  
  try {
    // Check if a user with the same name already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'This name is already taken. Please choose a different name.' });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({ message: 'Error checking for existing user', error });
  }
};

module.exports = { checkUniqueName };
