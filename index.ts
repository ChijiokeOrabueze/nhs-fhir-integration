import express, { Application } from 'express';
import fs from "fs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from 'axios';


const env = process.env.NODE_ENV;

const app: Application = express();



app.use(express.json());

const appId = "a3e29d55-3f7a-452e-b484-bf9fd8c8c932";
const apiKey = "0SIPQYEnd3kz620kGpYAkvVeZaG7iupO";
const apiSecret = "wperGRy6oQFVvOHX";

const generateAndSignJwt = () => {

    const privateKey = fs.readFileSync('test-1.pem');
    console.log(privateKey);
    const token = jwt.sign({ 
        "iss": apiKey,
        "sub": apiKey,
        "aud": "https://api.service.nhs.uk/oauth2/token",
        "jti": crypto.randomUUID(),
        "exp": (Date.now()/100) + 300,
          
     }, privateKey, { algorithm: 'RS512', header: {kid: "test-1", alg: 'RS512', typ: "JWT"} });

    return token;
};

const getAccessToken = async () => {

    try {
        const jwtToken = generateAndSignJwt();
        const tokenUrl = "https://int.api.service.nhs.uk/oauth2/token"
        const data = {
            "grant_type": "client_credentials",
            "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            "client_assertion": jwtToken
        };

     
        const token = await axios({
            url: tokenUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams(data as Record<string, string>)
        });
        return token;

    } catch (error: any) {
        console.log({ tokenExchangeError: error?.response?.data || error });
    }





}
app.get("/", (req, res) => {
    console.log("hi")
})



const init = async () => {


    app.listen(1313, () => {
        console.log('app started');
    })
};

init();
