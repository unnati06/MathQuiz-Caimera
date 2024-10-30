const express = require('express');
const User = require('../models/User');
const { checkUniqueName } = require('../middlewares/auth-middleware');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register a new user
router.post('/register',checkUniqueName, async (req, res) => {
  const { name } = req.body;

  try {
    const newUser = new User({ name });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, name: newUser.name }, 'secretkey', { expiresIn: '1h' });
    
    res.status(201).json({ message: 'User registered successfully!', user: newUser ,  token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

router.get('/currentUser',  async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authorization header is missing or has incorrect format.');
      return res.status(401).json({ message: 'Authorization header missing or incorrect format' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token);

    // Verify the token
    const decodedToken = jwt.verify(token, 'secretkey'); 
    console.log('Decoded token:', decodedToken);

    // Find the user by ID
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      console.log('User not found in database.');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error:', error.message || error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
