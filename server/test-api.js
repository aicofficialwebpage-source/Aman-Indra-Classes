// Programmatic test script for Aman Indra Classes API
const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING PLATFORM API ENDPOINT TESTS ---');
  
  // Test 1: Check root server connectivity
  try {
    const res = await fetch('http://localhost:5000/');
    const data = await res.json();
    console.log('✔ Test 1 passed: Server Root status check successfully:', data.message);
  } catch (err) {
    console.error('✖ Test 1 failed: Could not connect to Express server on port 5000:', err.message);
    return;
  }

  // Test 2: Submit a mock lead
  try {
    const payload = {
      studentName: 'Lakshya Gupta',
      parentName: 'Mr. R.K. Gupta',
      phone: '9988776655',
      email: 'lakshya@example.com',
      class: 'Class 11',
      schoolName: 'Singhania High School, Kanpur',
      course: 'IIT-JEE Preparation',
      message: 'Interested in evening batch timings.',
      type: 'Enquiry'
    };

    const res = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.status === 201) {
      console.log('✔ Test 2 passed: Mock lead submitted successfully:', data.lead.studentName);
    } else {
      console.error('✖ Test 2 failed: Server returned non-201 status code:', res.status, data.message);
    }
  } catch (err) {
    console.error('✖ Test 2 failed: Enquiry lead post call failed:', err.message);
  }

  // Test 3: Retrieve Website Settings
  try {
    const res = await fetch(`${API_URL}/settings`);
    const settings = await res.json();
    console.log('✔ Test 3 passed: Site settings fetch check successfully: headline =', settings.heroHeadline);
  } catch (err) {
    console.error('✖ Test 3 failed: Fetching settings threw error:', err.message);
  }

  // Test 4: Retrieve notices
  try {
    const res = await fetch(`${API_URL}/notices`);
    const notices = await res.json();
    console.log('✔ Test 4 passed: Live notice board fetch check successfully: notices count =', notices.length);
  } catch (err) {
    console.error('✖ Test 4 failed: notice boards fetch failed:', err.message);
  }

  console.log('--- ALL API ENDPOINT TESTS COMPLETED ---');
}

runTests();
