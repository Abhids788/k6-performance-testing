import http from "k6/http";
import {sleep} from "k6";

const config = JSON.parse(open(`/../configs/crocodiles_Config/${__ENV.ENV}_env.json`))

export function generateAuth0(){
    let auth0_url= config.authUrl;
    let request_body= {
        "username": "assidsd",
        "password": "password"
    }
    let response = http.post(auth0_url, request_body,{headers: { "Content-Type": "application/json" }}  
    );
    return response.json().access;
}

export function registerUser(){
    let registerUrl_url= config.registerUrl_url;
    let request_body= {
        "username": "assidsd",
        "first_name": "Abhj",
        "last_name": "Dss",
        "email": "asffsd@sdfdf.com",
        "password": "password"
    }
    let response = http.post(registerUrl_url, JSON.stringify(request_body), {
        headers: { "Content-Type": "application/json" }
    });

    return response.json().access; 
}