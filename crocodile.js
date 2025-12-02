import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import {generateAuth0} from "./Auth0Utility/auth0Utility.js";

export {getAllCrocodile} from "./Crocodile_Load_Scripts/scripts/getAllCrocodile.js";
export {getMyCrocodile} from "./Crocodile_Load_Scripts/scripts/getMyCrocodile.js";

const config = JSON.parse(open(`./configs/crocodiles_Config/${__ENV.ENV}_env.json`));


export function setup(){
    const token=generateAuth0();
    return {token : token, config: config};
}

export const options ={
    scenarios:{
        get_All_Crocodile_load_test: {
            executor: "constant-vus",
            vus: __ENV.VUS,
            duration: __ENV.DURATION+"s",
            exec: "getAllCrocodile",
            startTime: "0s"
        },
        get_All_Private_Crocodile_load_test: {
            executor: "constant-vus",
            vus: __ENV.VUS,
            duration: __ENV.DURATION+"s",
            exec: "getMyCrocodile",
            startTime: "0s"
        }
    },
    summaryTrendStats: [
        "avg",
        "min",
        "med",
        "max",
        "p(90)",
        "p(95)",
        "p(99)",
        "count"
    ]
}

export default function (){
    getAllCrocodile(data);
    getMyCrocodile(data);
}

export function handleSummary(data){
    return {
        [`./test_reports/crocodiles_report.html`]: htmlReport(data),
        stdout: textSummary(data,{indent: " ", enableColors: true}),
    };
}