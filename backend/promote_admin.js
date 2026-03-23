const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const promoteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { email: 'testuser1@example.com' },
      { role: 'admin' },
      { new: true }
    );
    console.log('User promoted:', user.name, user.role);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

promoteUser();
