import express, { Application } from 'express';
import fs from "fs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from 'axios';
import Client from 'fhir-kit-client'

const client = new Client({ baseUrl: 'https://int.api.service.nhs.uk/' })

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
        "aud": "https://int.api.service.nhs.uk/oauth2/token",
        "jti": crypto.randomUUID(),
        "exp": (Date.now()/1000) + 300,
          
     }, privateKey, { algorithm: 'RS512', header: {kid: "test-1", alg: 'RS512'} });

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
        console.log(token.data);
        return token.data.access_token;

    } catch (error: any) {
        console.log({ tokenExchangeError: error?.response?.data || error });
        throw error;
        
    }


}
app.get("/", async (req, res) => {

    try {
        const bearerToken = await getAccessToken()
        const headers:Record<string, string> = {
            // "apiKey": apiKey
            "Authorization": `Bearer ${bearerToken}`
        } 

        const result = await axios({
            // url: "https://sandbox.api.service.nhs.uk/personal-demographics/FHIR/R4/Patient",
            url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?",
            // url: "https://directory.spineservices.nhs.uk/STU3/Organization/002",
            // url: "https://sandbox.api.service.nhs.uk/hello-world/hello/application",
            method: 'GET',
            headers,
            // data: new URLSearchParams(data as Record<string, string>)
        });
        console.log(result.data);
        // return token.data.access_token;
    
        // const result = await client
        // .request("https://sandbox.api.service.nhs.uk/hello-world/hello/application", {
        //     method: "GET",
        //     headers
        // })
        res.json({result: result.data})
    }catch (err:any){
        res.send({ apiCallError: err?.response?.data || err });
    }
})



const init = async () => {


    app.listen(1313, () => {
        console.log('app started');
    })
};

init();
