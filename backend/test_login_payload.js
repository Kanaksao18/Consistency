const crypto = require('crypto');

const testAuthPayloads = async () => {
  const email = `admin_${crypto.randomBytes(4).toString('hex')}@example.com`;
  
  try {
    console.log(`Testing signup with ${email}...`);
    const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin Tester',
        email: email,
        password: 'Password123!'
      })
    });
    
    const signupData = await signupRes.json();
    console.log('Signup Response:', signupData.user);
    if (signupData.user && signupData.user.role === 'user') {
      console.log('SUCCESS: Signup payload includes default role (user).');
    } else {
      console.log('FAIL: Signup payload is missing role or incorrect.');
    }

    // Now test login
    console.log(`\nTesting login with ${email}...`);
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: 'Password123!'
      })
    });
    
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData.user);
    if (loginData.user && loginData.user.role === 'user') {
      console.log('SUCCESS: Login payload includes default role (user).');
    } else {
      console.log('FAIL: Login payload is missing role or incorrect.');
    }

  } catch (err) {
    console.error('Test Failed:', err);
  }
};

testAuthPayloads();
