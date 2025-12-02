import http from "k6/http";
import {sleep} from "k6";

const config = JSON.parse(open(`/../configs/crocodiles_Config/${__ENV.ENV}_env.json`))

export function generateAuth0(){
    let auth0_url= config.authUrl;
    let request_body= {
    "username": "abhidsd",
    "password": "password"
}

    let response = http.post(auth0_url, request_body,);
    return response.json().access;
    
}

