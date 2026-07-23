import http from 'k6/http';
import {check,sleep} from 'k6';
import {uuidv4} from 'https://jslib.k6.io/k6-utils/1.4.0/index.js'
// import { version } from 'os';

const BASE_URL='';
const SECRET="";

export const options={
    scenarios:
    {
        race_condition:{
              executor:'per-vu-iterations',
              exec: 'race_condition',
              vus:1,
              iterations:1,
              startTime:'0s',
        },
        replay_attack:{
            executor:'per-vu-iterations',
            exec:'replay_attack',
            vus:5,
            iterations:2,
            startTime:'5s',
        },
        throughput_spike:
        {
            executor:'ramping-vus',
            exec:'throughput_spike',
            startVUs:0,
            stages:[
                {duration:'10s',target:50},
                {duration:'20s',target:50},
                {duration:'5s',target:0}
            ],
            startTime:'10s'
        },
    },
};

export function race_condition()
{
    const fromUser="Alice";
    const currentVersion=13;
    const payload=JSON.stringify({
        fromUser: fromUser,
        toUser: "Bob",
        amount:1,
        forceVersion:currentVersion,
        idempotencyKey:uuidv4()
    }
    );
    const params={headers:{'content-type':'application/json','x-admin-secret':SECRET}};
    const responses=http.batch([
        ['POST',BASE_URL,payload,params],
        ['POST',BASE_URL,payload,params], 
        ['POST',BASE_URL,payload,params],
    ]
    )
    const successes=responses.filter(r=>r.status===200).length;
    const failures=responses.filter(r=> !(r.status===200)).length;
console.log(`[Race Test] Successes: ${successes}, Blocked: ${failures}`);
check(responses[0], {
    'Race Condition Caught': () => successes === 1 && failures >= 2,
  });
}

export function replay_attack() {
  const sharedKey = "uuid-replay-test-12123456"; 
  const payload = JSON.stringify({
    fromUser: "Alice",
    toUser: "Bob",
    amount: 10,
    idempotencyKey: sharedKey 
  });

  const params = { headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET } };
  const res = http.post(BASE_URL, payload, params);
  check(res, {
    'Replay handled gracefully'  : (r) => r.status === 200 || r.status === 409,
  });
}

export function throughput_spike() {
  const randomUser = `User_${Math.floor(Math.random() * 100)}`;
  const payload = JSON.stringify({
    fromUser: randomUser,
    toUser: "Bob",
    amount: 1,
    idempotencyKey: uuidv4()
  });
  
  const params = { headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET } };
  const res = http.post(BASE_URL, payload, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(0.1);
}



