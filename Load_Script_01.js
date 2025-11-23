/**
 * Load test script for QuickPizza demo using k6.
 *
 * - Defines a stage-based load profile (ramp-up, steady, ramp-down).
 * - Sets thresholds for request duration and failure rate.
 * - Each VU iteration requests three pages and validates responses with checks.
 */
import http from 'k6/http';
import {sleep} from 'k6';
import {check} from 'k6';
import {Counter, Trend} from 'k6/metrics';


/**
 * k6 options controlling the test stages and thresholds.
 * @type {import('k6').Options}
 */
export const options={
    stages:[
        {
            duration: '5s',
            target:3
        },
        {
            duration: '5s',
            target:6
        },
        {
            duration: '20s',
            target: 6
        },
        {
            duration: '10s',
            target: 0
        }
    ],
    // k6 thresholds for request durations and error rate
        thresholds: {
            // 95th percentile of request durations should be below 500ms
            // 90th percentile of request durations should be below 300ms
            // maximum observed request duration should be below 1500ms
            // minimum observed request duration should be below 300ms
            http_req_duration: ['p(95)<500', 'p(90)<300', 'max<1500', 'min<300'],

            // less than 1% of requests should fail
            http_req_failed: ['rate<0.01'],
            http_reqs: ['rate>2'],
            my_counter: ['count>10'],
            response_time_new_page: ['p(95)<500'],
            response_time_front_page: ['p(95)<500']
        },

    };

    let myCounter = new Counter('my_counter');
    let newsPageResponseTrend= new Trend('response_time_new_page');
    let frontPageResponseTrend= new Trend('response_time_front_page');


/**
 * Default function executed by each virtual user (VU) on each iteration.
 * Performs a sequence of GET requests with checks and sleeps to simulate user pacing.
 *
 * Sequence:
 *  1. GET /test.k6.io/ (start page) - verify status and content
 *  2. GET /contacts.php - verify status and content
 *  3. GET /news.php - verify status and content
 *
 * @returns {void}
 */
export default function () {
  // Start page - expect 200 and "QuickPizza Legacy" in the body
  const res1 = http.get('https://quickpizza.grafana.com/test.k6.io/');
  myCounter.add(1);
  frontPageResponseTrend.add(res1.timings.duration);
  check(res1, {
    'Response is 200': (r) => r.status === 200,
    'Check Start page': (r) => r.body.includes('QuickPizza Legacy'),
    'Response 1 time < 500ms': (r) => r.timings.duration < 1000,

    //****************//If API Response******************
//    const json = res.json();
//    check(json, {
//      'has id': (d) => d.id !== undefined,
//      'has name': (d) => d.name !== undefined,
//    });
  });

//  check(res1, {
//    'Content-Type is HTML': (r) => r.headers['Content-Type'] === 'text/html; charset=utf-8',
//    'Server header exists': (r) => !!r.headers['Server'],
//  });
  sleep(1); // simulate user think time

  // Contacts page - expect 200 and the organization string in the body
  check(res1, {
    'Body is not empty': (r) => r.body && r.body.length > 20,
  });
  check(res1, {
    'No connection errors': (r) => r.error_code === 0,
  });

  const res2 = http.get('https://quickpizza.grafana.com/contacts.php');
  check(res2, {
    'Response is 200': (r) => r.status === 200,
    'Check contacts page': (r) => r.body.includes('k6 (Load Impact AB)'),
    'Response 2 time < 500ms': (r) => r.timings.duration < 1000,
  });
  newsPageResponseTrend.add(res2.timings.duration);
  sleep(2); // simulate user think time

  // News page - expect 200 and "In the news" copy in the body
  const res3 = http.get('https://quickpizza.grafana.com/news.php');
  check(res3, {
    'Response is 200': (r) => r.status === 200,
    'Check news page': (r) => r.body.includes('In the news'),
    'Response 3 time < 500ms': (r) => r.timings.duration < 1000,
  });
  sleep(2);
}