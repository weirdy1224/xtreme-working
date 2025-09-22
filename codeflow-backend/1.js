import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:4000/api/v1';
const EXEC_URL = `${BASE_URL}/executeCode`;

// Replace with a real user from your DB
const USER_EMAIL = '1@gmail.com ';
const USER_PASSWORD = 'qwertyuiop'; 
const PROBLEM_ID = 'b2acc265-5992-46f1-bd02-0dec4f956e31'; // Make sure this problem exists

const sourceCode = `print("Hello World")`;
const languageId = 116; // Python 3

// 1️⃣ Login to get accessToken cookie
async function loginAndGetToken() {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ Login failed:', data);
      process.exit(1);
    }

    // Grab the cookie from headers
    const rawCookie = res.headers.get('set-cookie');
    if (!rawCookie) {
      console.error('❌ No cookie returned from login');
      process.exit(1);
    }

    // Extract accessToken value
    const match = rawCookie.match(/accessToken=([^;]+);/);
    if (!match) {
      console.error('❌ accessToken not found in cookie');
      process.exit(1);
    }

    const accessToken = match[1];
    console.log('✅ Logged in, got accessToken');
    return accessToken;
  } catch (err) {
    console.error('❌ Login error:', err);
    process.exit(1);
  }
}

// 2️⃣ Test /run endpoint
async function testRunCode(accessToken) {
  try {
    console.log('🔥 Testing /executeCode/run ...');

    const res = await fetch(`${EXEC_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        problemId: PROBLEM_ID,
      }),
    });

    const data = await res.json();
    console.log('Run Code Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error testing /run:', err);
  }
}

// 3️⃣ Test /submit endpoint
async function testSubmitCode(accessToken) {
  try {
    console.log('🔥 Testing /executeCode/submit ...');

    const res = await fetch(`${EXEC_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        problemId: PROBLEM_ID,
      }),
    });

    const data = await res.json();
    console.log('Submit Code Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error testing /submit:', err);
  }
}

async function main() {
  const token = await loginAndGetToken();
  await testRunCode(token);
  console.log('-------------------------------------------------');
  await testSubmitCode(token);
}

main();
