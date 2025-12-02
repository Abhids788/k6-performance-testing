import http from "k6/http";
import {group} from "k6";
import {Counter, Trend} from 'k6/metrics';
import {validateStatus} from "../../commonUtils/Utils.js"

const slowRequests = new Counter('getDetails_slow_requests');
const RequestDurations = new Trend ('getDetails_request_durations');
const slowRequestsDuration = new Trend ('getDetails_slowRequest_durations');
// const config = JSON.parse(open(`../../configs/crocodiles_Config/${__ENV.ENV}_env.json`));

export function getMyCrocodile(data){
    
    group("Get My Crocodiles", () => {
        console.log("TokenG:"+ data.token)
        const headers={
            Authorization: `Bearer ${data.token}`
        };        
        let response = http.get(    
            `${data.config.serviceUrl}/my/crocodiles/`,
            {
                headers: headers
            }
        )

        RequestDurations.add(response.timings.duration);
        if(response.timings.duration >300){
            slowRequests,add(1);
            slowRequestsDuration.add(response.timings.duration);
            console.log(
                `Slow request detected!
                Duration: ${response.timings.duration}ms
                Status: ${response.status}`
            )
        }
        validateStatus(response,200);
    })
}