const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  console.log('Testing dependencies...');
  try {
    const hash = await bcrypt.hash('password123', 10);
    console.log('Bcrypt hash successful:', hash);
    
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection successful');
    
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();
