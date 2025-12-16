console.log('Testing Supabase connection...\n');

// Check environment variables
console.log('Checking environment variables:');
try {
  require('dotenv').config();
  console.log('✅ dotenv loaded');
} catch (e) {
  console.log('❌ dotenv not available');
}

// Check for required env vars
const envVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\nTesting Supabase client creation...');
try {
  const { createClient } = require('./lib/supabase-client.ts');
  const supabase = createClient();
  console.log('✅ Supabase client created successfully');
  
  // Test a simple query
  console.log('\nTesting database connection...');
  supabase.auth.getSession()
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Auth session error:', error.message);
      } else {
        console.log('✅ Auth session check passed');
      }
    })
    .catch(err => {
      console.log('❌ Unexpected error:', err.message);
    });
} catch (err) {
  console.log('❌ Failed to create Supabase client:', err.message);
}
