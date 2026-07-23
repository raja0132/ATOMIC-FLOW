import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// ⚠️ CHANGE THIS to your live Amplify URL
const BASE_URL='https://main.d38465pe8k3hwb.amplifyapp.com/api/stress-test';
const SECRET="UQB/lK5fO0/oFPN471XFanjsP8kcbEVONoGyCMBGy58=";

export const options = {
  scenarios: {
    cloud_spike: {
      // 'shared-iterations' tells k6 to execute an exact number of requests
      executor: 'shared-iterations',
      vus: 1,               // 150 concurrent virtual users attacking at once
      iterations: 5,      // Exactly 50,000 total requests
      maxDuration: '5m',      // Hard stop after 5 minutes just in case
    },
  },
};

export default function () {
  const senderId = `User_${Math.floor(Math.random() * 100)}`;
  const receiverId= `User_${Math.floor(Math.random() * 100)}`;
  
  const payload = JSON.stringify({
    fromUser: senderId,
    toUser: receiverId,
    amount: 1,
    idempotencyKey: uuidv4() 
  });

  const params = { 
    headers: { 
      'Content-Type': 'application/json', 
      'x-admin-secret': SECRET 
    } 
  };
  
  const res = http.post(BASE_URL, payload, params);
  console.log(`Status: ${res.status} | Response: ${res.body}`);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}