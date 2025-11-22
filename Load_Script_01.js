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


/**
 * k6 options controlling the test stages and thresholds.
 * @type {import('k6').Options}
 */
export const options={
    stages:[
        {
            duration: '5s',
            target:10
        },
        {
            duration: '5s',
            target:20
        },
        {
            duration: '100s',
            target: 20
        },
        {
            duration: '10s',
            target: 0
        }
    ],
    thresholds: {
        // 95th percentile of request durations should be below 500ms
        http_req_duration: ['p(95)<500'],
        // less than 1% of requests should fail
        http_req_failed: ['rate<0.01'],
      },
    };



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
  check(res1, {
    'Response is 200': (r) => r.status === 200,
    'Check Start page': (r) => r.body.includes('QuickPizza Legacy'),
  });
  sleep(1); // simulate user think time

  // Contacts page - expect 200 and the organization string in the body
  const res2 = http.get('https://quickpizza.grafana.com/contacts.php');
  check(res2, {
    'Response is 200': (r) => r.status === 200,
    'Check contacts page': (r) => r.body.includes('k6 (Load Impact AB)'),
  });
  sleep(2); // simulate user think time

  // News page - expect 200 and "In the news" copy in the body
  const res3 = http.get('https://quickpizza.grafana.com/news.php');
  check(res3, {
    'Response is 200': (r) => r.status === 200,
    'Check news page': (r) => r.body.includes('In the news'),
  });
  sleep(2);
}