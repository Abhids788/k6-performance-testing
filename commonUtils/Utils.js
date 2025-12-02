import {check} from "k6";
import {checkResponse} from 'https://raw.githubusercontent.com/gpiechnik2/k6-errors-reporter/main/dist/bundle.js';

export function validateStatus(response,expectedStatus){
    let status;
    status = check(response, {"Expected status is met": (r) => r.status == expectedStatus});
    checkResponse(response,status);
}