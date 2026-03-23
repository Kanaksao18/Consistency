const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = admin;
